import { MongoClient } from 'mongodb';
import { Worker } from 'bullmq';
import { redisConnection, QueueNames } from '@adg/server-shared-bullmq';
import {
  LotCreatedEvent,
  LotUpdatedEvent,
  handleLotUpdatedEvent,
  handleLotCreatedEvent,
} from '@adg/server-domain-lot-events';

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017';
const DB_NAME = process.env.READ_MODEL_DB_NAME || 'read-model';
async function main() {
  // Import chalk dynamically to avoid issues with ESM and CommonJS
  const chalk = (await import('chalk')).default;

  // connect to MongoDB
  const mongoClient = new MongoClient(MONGO_URI);
  await mongoClient.connect();
  const db = mongoClient.db(DB_NAME);
  const lotsCollection = db.collection('lots');

  // Set up BullMQ Worker for lot events
  const worker = new Worker(
    QueueNames.DOMAIN_EVENTS,
    async (job) => {
      const { name, data } = job;
      console.log('name:', name);
      console.log('data:', data);

      // Handle LotCreatedEvent
      if (name === 'LotCreatedEvent') {
        await handleLotCreatedEvent(data as LotCreatedEvent, lotsCollection);
      }

      // Handle LotUpdatedEvent
      if (name === 'LotUpdatedEvent') {
        await handleLotUpdatedEvent(data as LotUpdatedEvent, lotsCollection);
      }
    },
    { connection: redisConnection }
  );

  worker.on('completed', async (job) => {
    const chalk = (await import('chalk')).default;
    console.log(chalk.blue(`Processed job ${job.id} of type ${job.name}`));
  });

  worker.on('failed', async (job, err) => {
    const chalk = (await import('chalk')).default;
    console.error(
      chalk.red(`Failed job ${job?.id} of type ${job?.name}:`),
      err
    );
  });

  console.log(
    chalk.blueBright(
      'Lot event processor worker started and listening for events...'
    )
  );
}
main().catch((err) => {
  console.error('Failed to start lot event processor:', err);
});
