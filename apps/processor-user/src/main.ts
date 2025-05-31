import { Worker, Job, Queue as BullQueue } from 'bullmq'; // Renamed Queue to BullQueue to avoid conflict
import { v4 as uuidv4 } from 'uuid';
import * as dotenv from 'dotenv';

import {
  redisConnection,
  USER_COMMANDS_QUEUE,
  DOMAIN_EVENTS_QUEUE,
} from '@adg/server-bullmq-config'; // Adjust
import { MongoEventStore, IEventStore } from '@adg/server-event-store'; // Adjust

import { ICommand, IDomainEvent } from '@adg/server-shared';
import {
  CREATE_USER_COMMAND,
  UPDATE_USER_NAME_COMMAND,
} from '@adg/server-user';
import { CreateUserPayload, UpdateUserNamePayload } from '@adg/global-models';
import { UserAggregate } from './user.aggregate';

dotenv.config();

const eventStore: IEventStore = new MongoEventStore();
const domainEventsQueue = new BullQueue<IDomainEvent>(DOMAIN_EVENTS_QUEUE, {
  connection: redisConnection,
});

const userWorker = new Worker(
  USER_COMMANDS_QUEUE,
  async (job: Job<ICommand>) => {
    const command = job.data;
    console.log(`Processing command: ${command.commandName}`, command.payload);

    let aggregateId = command.aggregateId;
    if (command.commandName === CREATE_USER_COMMAND) {
      // For create commands, the payload might contain a suggested userId or we generate one.
      // The aggregateId for event store purposes will be this userId.
      aggregateId = (command.payload as CreateUserPayload)?.id || uuidv4();
    }

    if (!aggregateId) {
      console.error(
        `Aggregate ID is missing for command ${command.commandName}`
      );
      throw new Error(
        `Aggregate ID is missing for command ${command.commandName}`
      );
    }

    const userAggregate = new UserAggregate(aggregateId); // Pass ID for existing or new

    try {
      // 1. Load existing events for the aggregate (if any)
      //    This will bring the aggregate to its current state.
      const history = await eventStore.getEventsForAggregate(aggregateId);
      userAggregate.loadFromHistory(history);

      // 2. Apply the command to the aggregate
      //    This is where business logic is executed and new events are generated (but not yet saved).
      switch (command.commandName) {
        case CREATE_USER_COMMAND: {
          const createUserCmdPayload = command.payload as CreateUserPayload;
          // System-wide uniqueness check for email should ideally happen *before* this point,
          // e.g., by querying a read model or a unique index.
          // The createUser method on the aggregate now only checks its internal state.
          userAggregate.createUser({
            lastName: createUserCmdPayload.lastName,
            firstName: createUserCmdPayload?.firstName,
            fullName: createUserCmdPayload?.fullName,
            email: createUserCmdPayload.email,
          });
          break;
        }
        case UPDATE_USER_NAME_COMMAND:
          userAggregate.updateName(command.payload as UpdateUserNamePayload);
          break;
        default:
          console.warn(`Unknown command: ${command.commandName}`);
          throw new Error(`Unknown command: ${command.commandName}`);
      }

      // 3. Save new events to the event store
      const uncommittedEvents = userAggregate.uncommittedEvents;
      if (uncommittedEvents.length > 0) {
        // The expected version for saving is the aggregate's version *before* new events were applied.
        const expectedVersion =
          userAggregate.version - uncommittedEvents.length;

        await eventStore.saveEvents(
          userAggregate.aggregateId,
          userAggregate.aggregateType,
          expectedVersion, // Version before new events were applied to the aggregate instance
          uncommittedEvents as IDomainEvent[] // Cast if necessary
        );
        userAggregate.markEventsAsCommitted(); // Clear uncommitted events from aggregate

        // 4. Publish events to the domain events queue for other services (e.g., query service)
        for (const event of uncommittedEvents) {
          await domainEventsQueue.add(event.eventType, event);
          console.log(`Published event: ${event.eventType}`, event.payload);
        }
      } else {
        console.log(
          `No events to commit for command ${command.commandName} on aggregate ${aggregateId}`
        );
      }
    } catch (error) {
      console.error(
        `Error processing command ${command.commandName} for aggregate ${aggregateId}:`,
        error
      );
      // Implement retry logic or move to dead-letter queue as needed
      // For example, if a unique constraint on email in the read model fails, this might throw.
      throw error; // Re-throw to let BullMQ handle job failure (retry, move to failed)
    }
  },
  { connection: redisConnection, concurrency: 5 } // Adjust concurrency as needed
);

userWorker.on('completed', (job) => {
  console.log(`Job ${job.id} (type: ${job.name}) completed successfully.`);
});

userWorker.on('failed', (job, err) => {
  console.error(
    `Job ${job?.id} (type: ${job?.name}) failed with error: ${err.message}`,
    err.stack
  );
});

console.log('User Processor Worker started.');

// Graceful shutdown
async function shutdown() {
  console.log('Shutting down User Processor Worker...');
  await userWorker.close();
  await domainEventsQueue.close();
  if (typeof (eventStore as MongoEventStore).disconnect === 'function') {
    await (eventStore as MongoEventStore).disconnect();
  }
  console.log('User Processor Worker shut down.');
  process.exit(0);
}
process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown); // For Ctrl+C
