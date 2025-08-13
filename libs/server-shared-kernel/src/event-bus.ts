// Define generic, event-class-agnostic contracts so adapters can choose their own event shape.

export type EventHandler<E = unknown> = (event: E) => Promise<void>;

export interface IEventBus<E = unknown> {
  /**
   * Publish one or more events to the bus.
   */
  publish(events: E | E[]): Promise<void>;

  /**
   * Subscribe to an event type.
   */
  subscribe<T extends E = E>(eventType: string, handler: EventHandler<T>): void;

  /**
   * Unsubscribe from an event type.
   */
  unsubscribe<T extends E = E>(
    eventType: string,
    handler: EventHandler<T>
  ): void;
}
