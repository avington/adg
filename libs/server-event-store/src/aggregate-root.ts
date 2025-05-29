import { IDomainEvent } from '@adg/server-shared';

export type { IDomainEvent } from '@adg/server-shared';

export abstract class AggregateRoot<E extends IDomainEvent = IDomainEvent> {
  public readonly aggregateId: string;
  public version = 0;
  private readonly _uncommittedEvents: E[] = [];

  constructor(id: string) {
    this.aggregateId = id;
  }

  public get uncommittedEvents(): ReadonlyArray<E> {
    return this._uncommittedEvents;
  }

  public markEventsAsCommitted(): void {
    this._uncommittedEvents.length = 0; // Clear the array
  }

  protected apply<T extends E>(event: T, isFromHistory = false): void {
    // Dynamically call the appropriate 'on<EventName>' method
    const handlerMethodName = `on${event.eventType}`;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handler = (this as any)[handlerMethodName];

    if (!handler) {
      console.warn(
        `No event handler found for ${event.eventType} on ${this.constructor.name}`
      );
      return;
    }

    handler.call(this, event);

    if (!isFromHistory) {
      this._uncommittedEvents.push(event);
      this.version++; // Increment version for new events
    } else {
      // When loading from history, the event already has its version
      this.version = event.version;
    }
  }

  public loadFromHistory(history: ReadonlyArray<E>): void {
    history.forEach((event) => this.apply(event, true));
  }

  abstract get aggregateType(): string;
}
