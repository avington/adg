import { IEvent } from './event';

export abstract class AggregateRoot<E extends IEvent = IEvent> {
  public readonly aggregateId: string;
  public version = -1; // -1 means no events applied yet
  protected _uncommittedEvents: E[] = [];

  constructor(aggregateId: string) {
    this.aggregateId = aggregateId;
  }

  get uncommittedEvents(): E[] {
    return this._uncommittedEvents;
  }

  public markEventsAsCommitted(): void {
    this._uncommittedEvents = [];
  }

  protected apply<T extends E>(event: T, isFromHistory = false): void {
    // Call the event handler if it exists
    const handlerName = `on${event.type}`;
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    if (typeof this[handlerName] === 'function') {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      this[handlerName](event);
    }

    // Set version from event
    this.version = event.version;

    // Track uncommitted events if not replaying from history
    if (!isFromHistory) {
      this._uncommittedEvents.push(event);
    }
  }

  // Replay events from history to rebuild aggregate state
  public loadFromHistory(events: E[]): void {
    for (const event of events) {
      this.apply(event, true);
    }
  }
}
