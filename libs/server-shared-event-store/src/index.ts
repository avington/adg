import { Collection, Db, MongoClient } from 'mongodb';
import { IEvent, IEventStore } from '@adg/server-shared-kernel';

export class MongoEventStore<E extends IEvent = IEvent>
  implements IEventStore<E>
{
  private client!: MongoClient;
  private db!: Db;
  private eventsCollection!: Collection;

  constructor(
    private uri: string,
    private dbName: string,
    private collectionName = 'events'
  ) {}

  async connect() {
    this.uri = process.env.MONGO_URI || this.uri;
    this.client = new MongoClient(this.uri);
    await this.client.connect();
    this.db = this.client.db(this.dbName);
    this.eventsCollection = this.db.collection(this.collectionName);
    // Optionally create index for aggregateId and version for concurrency
    await this.eventsCollection.createIndex(
      { aggregateId: 1, version: 1 },
      { unique: true }
    );
  }

  async saveEvents(
    aggregateId: string,
    aggregateType: string,
    expectedVersion: number,
    events: E[]
  ): Promise<void> {
    if (!this.eventsCollection) {
      throw new Error('MongoEventStore: Not connected');
    }
    // Get latest event for concurrency check
    const latestEvent = await this.eventsCollection
      .find({ aggregateId })
      .sort({ version: -1 })
      .limit(1)
      .next();

    const currentVersion = latestEvent ? latestEvent.version : -1;
    if (currentVersion !== expectedVersion) {
      throw new Error(
        `Concurrency conflict for aggregate ${aggregateId}. Expected version ${expectedVersion}, but was ${currentVersion}.`
      );
    }

    // Serialize and insert events
    const docs = events.map((event) => ({
      ...event,
      timestamp:
        event.timestamp instanceof Date
          ? event.timestamp
          : new Date(event.timestamp),
      aggregateType,
    }));

    if (docs.length > 0) {
      await this.eventsCollection.insertMany(docs);
    }
  }

  async getEventsForAggregate(aggregateId: string): Promise<E[]> {
    if (!this.eventsCollection) {
      throw new Error('MongoEventStore: Not connected');
    }
    const docs = await this.eventsCollection
      .find({ aggregateId })
      .sort({ version: 1 })
      .toArray();

    // Deserialize events (ensure timestamp is Date)
    return docs.map((doc) => ({
      ...doc,
      timestamp:
        doc.timestamp instanceof Date ? doc.timestamp : new Date(doc.timestamp),
    })) as unknown as E[];
  }

  async disconnect() {
    await this.client?.close();
  }
}
