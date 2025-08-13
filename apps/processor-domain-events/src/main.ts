import 'dotenv/config';
import { MongoClient, Collection } from 'mongodb';
import { Worker, Job } from 'bullmq';
import { redisConnection, QueueNames } from '@adg/server-shared-bullmq';
import { EventBus } from '@adg/server-shared-kernel';

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

import {
  PositionCreatedEvent,
  handlePositionCreatedEvent,
} from '@adg/server-domain-position-events';

// User events
import {
  handleUserCreatedEvent,
  UserCreatedEvent,
} from '@adg/server-domain-user-events';

import { SagaInitializationService } from '@adg/server-domain-lot-sagas';

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017';
const DB_NAME = process.env.READ_MODEL_DB_NAME || 'adg_read_model_db';
console.log(
  '[processor] READ_MODEL_DB_NAME =',
  process.env.READ_MODEL_DB_NAME,
  ' -> using',
  DB_NAME
);

// Strongly type read-model collections used locally
import type { PositionOverviewModel, LotDoc } from '@adg/global-models';

// Map event names to their concrete event classes
type DomainEventMap = {
  LotCreatedEvent: LotCreatedEvent;
  LotUpdatedEvent: LotUpdatedEvent;
  PortfolioCreatedEvent: PortfolioCreatedEvent;
  PortfolioUpdatedEvent: PortfolioUpdatedEvent;
  PositionCreatedEvent: PositionCreatedEvent;
  UserCreatedEvent: UserCreatedEvent;
};

type DomainEventName = keyof DomainEventMap;
type EventData = DomainEventMap[DomainEventName];

function rehydrateLotEvent<
  K extends Extract<DomainEventName, 'LotCreatedEvent' | 'LotUpdatedEvent'>
>(name: K, data: DomainEventMap[K]): DomainEventMap[K] | null {
  const ts = data.timestamp ? new Date(data.timestamp) : new Date();

  switch (name) {
    case 'LotCreatedEvent':
      return new LotCreatedEvent(
        data.id,
        data.aggregateId,
        data.version,
        data.payload,
        ts
      ) as DomainEventMap[K];
    case 'LotUpdatedEvent':
      return new LotUpdatedEvent(
        data.id,
        data.aggregateId,
        data.version,
        data.payload,
        ts
      ) as DomainEventMap[K];
    default:
      return null;
  }
}

async function main() {
  const chalk = (await import('chalk')).default;
  console.log(chalk.blue('Starting unified domain events processor...'));

  const mongoClient = new MongoClient(MONGO_URI);
  await mongoClient.connect();
  const db = mongoClient.db(DB_NAME);

  const lotsCollection: Collection<LotDoc> = db.collection<LotDoc>('lots');
  const portfoliosCollection = db.collection('portfolios');
  const positionsOverviewsCollection: Collection<PositionOverviewModel> =
    db.collection<PositionOverviewModel>('position-overviews');
  const usersCollection = db.collection('users');

  // Initialize in-process EventBus and Sagas
  const localEventBus = new EventBus();
  const sagaService = new SagaInitializationService(
    localEventBus,
    lotsCollection,
    positionsOverviewsCollection
  );
  sagaService.initializeSagas();

  const eventHandlers: {
    [K in DomainEventName]: (data: DomainEventMap[K]) => Promise<void>;
  } = {
    LotCreatedEvent: (data) => handleLotCreatedEvent(data, lotsCollection),
    LotUpdatedEvent: (data) => handleLotUpdatedEvent(data, lotsCollection),
    PortfolioCreatedEvent: (data) =>
      handlePortfolioCreatedEvent(data, portfoliosCollection),
    PortfolioUpdatedEvent: (data) =>
      handlePortfolioUpdatedEvent(data, portfoliosCollection),
    UserCreatedEvent: (data) => handleUserCreatedEvent(data, usersCollection),
    PositionCreatedEvent: (data) =>
      handlePositionCreatedEvent(data, positionsOverviewsCollection),
  };

  const worker = new Worker<EventData, void, DomainEventName>(
    QueueNames.DOMAIN_EVENTS,
    async (job: Job<EventData, void, DomainEventName>) => {
      const { name, data } = job;
      const chalk = (await import('chalk')).default;
      console.log(chalk.cyan(`Processing event: ${name}`));
      console.log(chalk.gray('Event data:'), data);

      try {
        // Call the correct handler with correct type without using any
        if (name === 'LotCreatedEvent')
          await eventHandlers.LotCreatedEvent(data as LotCreatedEvent);
        else if (name === 'LotUpdatedEvent')
          await eventHandlers.LotUpdatedEvent(data as LotUpdatedEvent);
        else if (name === 'PortfolioCreatedEvent')
          await eventHandlers.PortfolioCreatedEvent(
            data as PortfolioCreatedEvent
          );
        else if (name === 'PortfolioUpdatedEvent')
          await eventHandlers.PortfolioUpdatedEvent(
            data as PortfolioUpdatedEvent
          );
        else if (name === 'UserCreatedEvent')
          await eventHandlers.UserCreatedEvent(data as UserCreatedEvent);
        else if (name === 'PositionCreatedEvent')
          await eventHandlers.PositionCreatedEvent(
            data as PositionCreatedEvent
          );

        // Publish only lot events to the in-process bus
        if (name === 'LotCreatedEvent' || name === 'LotUpdatedEvent') {
          const evt = rehydrateLotEvent(
            name,
            data as Extract<EventData, LotCreatedEvent | LotUpdatedEvent>
          );
          if (evt) {
            await localEventBus.publish([evt]);
          }
        }
      } catch (error) {
        console.error(chalk.red(`Error processing ${name}:`), error);
        throw error;
      }
    },
    {
      connection: redisConnection,
      concurrency: 5,
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

  process.on('SIGINT', async () => {
    console.log(chalk.yellow('Shutting down worker...'));
    await worker.close();
    await mongoClient.close();
    process.exit(0);
  });

  process.on('SIGTERM', async () => {
    console.log(chalk.yellow('Shutting down worker (SIGTERM)...'));
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
