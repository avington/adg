import { MongoClient } from 'mongodb';
import { Worker } from 'bullmq';
import { redisConnection, QueueNames } from '@adg/server-shared-bullmq';

// Lot events
import {
  LotCreatedEvent,
  LotUpdatedEvent,
  handleLotUpdatedEvent,
  handleLotCreatedEvent,
} from '@adg/server-domain-lot-events';

// Portfolio events
import {
  handlePortfolioCreatedEvent,
  handlePortfolioUpdatedEvent,
  PortfolioCreatedEvent,
  PortfolioUpdatedEvent,
} from '@adg/server-domain-portfolio-events';

// User events
import {
  handleUserCreatedEvent,
  UserCreatedEvent,
} from '@adg/server-domain-user-events';

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017';
const DB_NAME = process.env.READ_MODEL_DB_NAME || 'read-model';

async function main() {
  // Import chalk dynamically to avoid issues with ESM and CommonJS
  const chalk = (await import('chalk')).default;
  console.log(chalk.blue('Starting unified domain events processor...'));

  // Connect to MongoDB
  const mongoClient = new MongoClient(MONGO_URI);
  await mongoClient.connect();
  const db = mongoClient.db(DB_NAME);

  // Collections for each domain
  const lotsCollection = db.collection('lots');
  const portfoliosCollection = db.collection('portfolios');
  const usersCollection = db.collection('users'); // Define event handlers mapping
  type EventData =
    | LotCreatedEvent
    | LotUpdatedEvent
    | PortfolioCreatedEvent
    | PortfolioUpdatedEvent
    | UserCreatedEvent;

  const eventHandlers: Record<string, (data: EventData) => Promise<void>> = {
    LotCreatedEvent: (data) =>
      handleLotCreatedEvent(data as LotCreatedEvent, lotsCollection),
    LotUpdatedEvent: (data) =>
      handleLotUpdatedEvent(data as LotUpdatedEvent, lotsCollection),
    PortfolioCreatedEvent: (data) =>
      handlePortfolioCreatedEvent(
        data as PortfolioCreatedEvent,
        portfoliosCollection
      ),
    PortfolioUpdatedEvent: (data) =>
      handlePortfolioUpdatedEvent(
        data as PortfolioUpdatedEvent,
        portfoliosCollection
      ),
    UserCreatedEvent: (data) =>
      handleUserCreatedEvent(data as UserCreatedEvent, usersCollection),
  };

  // Set up unified BullMQ Worker for all domain events
  const worker = new Worker(
    QueueNames.DOMAIN_EVENTS,
    async (job) => {
      const { name, data } = job;
      console.log(chalk.cyan(`Processing event: ${name}`));
      console.log(chalk.gray('Event data:'), data);

      try {
        const handler = eventHandlers[name];
        if (handler) {
          await handler(data);
        } else {
          console.warn(
            chalk.yellow(`No handler found for event type: ${name}`)
          );
        }
      } catch (error) {
        console.error(chalk.red(`Error processing ${name}:`), error);
        throw error; // Re-throw to mark job as failed
      }
    },
    {
      connection: redisConnection,
      concurrency: 5, // Process up to 5 jobs concurrently
    }
  );

  worker.on('completed', async (job) => {
    const chalk = (await import('chalk')).default;
    console.log(chalk.green(`✓ Processed job ${job.id} of type ${job.name}`));
  });

  worker.on('failed', async (job, err) => {
    const chalk = (await import('chalk')).default;
    console.error(
      chalk.red(`✗ Failed job ${job?.id} of type ${job?.name}:`),
      err
    );
  });

  worker.on('error', async (err) => {
    const chalk = (await import('chalk')).default;
    console.error(chalk.red('Worker error:'), err);
  });

  // Graceful shutdown
  process.on('SIGINT', async () => {
    console.log(chalk.yellow('Shutting down worker...'));
    await worker.close();
    await mongoClient.close();
    process.exit(0);
  });

  console.log(
    chalk.blueBright(
      '🚀 Unified domain events processor started and listening for all events...'
    )
  );
}

main().catch((err) => {
  console.error('Failed to start domain events processor:', err);
  process.exit(1);
});
