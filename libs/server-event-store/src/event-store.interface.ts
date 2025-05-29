import { IDomainEvent } from '@adg/server-shared';

export interface IEventStore {
  saveEvents(
    aggregateId: string,
    aggregateType: string,
    expectedVersion: number,
    events: IDomainEvent[]
  ): Promise<void>;

  getEventsForAggregate(aggregateId: string): Promise<IDomainEvent[]>;
}
