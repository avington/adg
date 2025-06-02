import { IEvent } from './event';

export interface IEventStore<E extends IEvent = IEvent> {
  /**
   * Persist new events for an aggregate.
   * @param aggregateId The ID of the aggregate.
   * @param aggregateType The type of the aggregate.
   * @param expectedVersion The version the aggregate is expected to be at (for concurrency control).
   * @param events The events to save.
   */
  saveEvents(
    aggregateId: string,
    aggregateType: string,
    expectedVersion: number,
    events: E[]
  ): Promise<void>;

  /**
   * Retrieve all events for a given aggregate.
   * @param aggregateId The ID of the aggregate.
   */
  getEventsForAggregate(aggregateId: string): Promise<E[]>;
}
