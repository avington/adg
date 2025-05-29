import * as dotenv from 'dotenv';
import { MongoClient, Db, Collection } from 'mongodb';
import { IEventStore } from './event-store.interface';
import { IDomainEvent } from '@adg/server-shared';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI;
const DB_NAME = process.env.EVENT_STORE_DB_NAME;
const EVENTS_COLLECTION = 'events';

if (!MONGO_URI || !DB_NAME) {
  throw new Error('MONGO_URI and EVENT_STORE_DB_NAME must be defined in .env');
}

export class MongoEventStore implements IEventStore {
  private client!: MongoClient;
  private db!: Db;
  private eventsCollection!: Collection<IDomainEvent>;

  constructor() {
    if (!MONGO_URI || !DB_NAME) {
      throw new Error(
        'MONGO_URI and EVENT_STORE_DB_NAME must be defined in .env'
      );
    }
  }

  public async connect(): Promise<void> {
    if (!this.client || !this.client?.db) {
      this.client = new MongoClient(MONGO_URI ?? '');
      await this.client.connect();
      this.db = this.client.db(DB_NAME);
      this.eventsCollection =
        this.db.collection<IDomainEvent>(EVENTS_COLLECTION);
      console.log('Connected to MongoDB Event Store');
      // Create index for efficient querying
      await this.eventsCollection.createIndex(
        { aggregateId: 1, version: 1 },
        { unique: true }
      );
      await this.eventsCollection.createIndex({ aggregateId: 1, timestamp: 1 });
    }
  }

  public async disconnect(): Promise<void> {
    if (this.client) {
      await this.client.close();
      console.log('Disconnected from MongoDB Event Store');
    }
  }

  async saveEvents(
    aggregateId: string,
    aggregateType: string,
    expectedVersion: number,
    events: IDomainEvent[]
  ): Promise<void> {
    if (!events || events.length === 0) {
      return;
    }
    await this.connect();

    // Basic concurrency check (can be more robust with transactions if needed)
    const latestEvent = await this.eventsCollection.findOne(
      { aggregateId },
      { sort: { version: -1 } }
    );

    const currentVersion = latestEvent ? latestEvent.version : -1; // -1 for new aggregate

    if (currentVersion !== expectedVersion) {
      throw new Error(
        `Concurrency conflict for aggregate ${aggregateId}. Expected version ${expectedVersion}, but was ${currentVersion}.`
      );
    }

    let version = currentVersion;
    const eventsToSave = events.map((event) => {
      version++;
      return {
        ...event,
        aggregateId,
        aggregateType,
        version, // Assign sequential version numbers
        timestamp: event.timestamp || new Date(), // Ensure timestamp
      };
    });

    try {
      await this.eventsCollection.insertMany(eventsToSave as any); // Cast if IDomainEvent doesn't perfectly match MongoDB schema
    } catch (error) {
      // Handle potential duplicate key errors if index is on aggregateId + version
      console.error('Error saving events:', error);
      throw error;
    }
  }

  async getEventsForAggregate(aggregateId: string): Promise<IDomainEvent[]> {
    await this.connect();
    const events = await this.eventsCollection
      .find({ aggregateId })
      .sort({ version: 1 }) // Ensure events are in order
      .toArray();
    return events as IDomainEvent[]; // Cast if necessary
  }
}
