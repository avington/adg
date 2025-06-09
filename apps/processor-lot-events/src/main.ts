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
      console.log(`Processing job ${job.id} of type ${name}`);
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

  worker.on('completed', (job) => {
    console.log(`Processed job ${job.id} of type ${job.name}`);
  });

  worker.on('failed', (job, err) => {
    console.error(`Failed job ${job?.id} of type ${job?.name}:`, err);
  });

  console.log('Lot event processor worker started and listening for events...');
}
main().catch((err) => {
  console.error('Failed to start lot event processor:', err);
});
