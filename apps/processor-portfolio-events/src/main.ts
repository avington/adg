import { MongoClient } from 'mongodb';
import { Worker } from 'bullmq';
import { redisConnection, QueueNames } from '@adg/server-shared-bullmq';
import {
  handlePortfolioCreatedEvent,
  handlePortfolioUpdatedEvent,
  PortfolioCreatedEvent,
  PortfolioUpdatedEvent,
} from '@adg/server-domain-portfolio-events';

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017';
const DB_NAME = process.env.READ_MODEL_DB_NAME || 'read-model';

async function main() {
  // Connect to MongoDB
  const mongoClient = new MongoClient(MONGO_URI);
  await mongoClient.connect();
  const db = mongoClient.db(DB_NAME);

  const portfoliosCollection = db.collection('portfolios');

  // Set up BullMQ Worker for portfolio events
  const worker = new Worker(
    QueueNames.DOMAIN_EVENTS,
    async (job) => {
      const { name, data } = job;
      // Handle PortfolioCreatedEvent
      if (name === 'PortfolioCreatedEvent') {
        await handlePortfolioCreatedEvent(
          data as PortfolioCreatedEvent,
          portfoliosCollection
        );
      }

      // Handle PortfolioUpdatedEvent
      if (name === 'PortfolioUpdatedEvent') {
        await handlePortfolioUpdatedEvent(
          data as PortfolioUpdatedEvent,
          portfoliosCollection
        );
      }
    },
    { connection: redisConnection }
  );

  worker.on('completed', (job) => {
    console.log(`Processed job ${job.id} of type ${job.name}`);
  });

  worker.on('failed', (job, err) => {
    console.error(`Failed job ${job?.id} of type ${job?.name}:`, err);
  });

  console.log(
    'User event processor worker started and listening for events...'
  );
}

main().catch((err) => {
  console.error('Failed to start user event processor:', err);
  process.exit(1);
});
