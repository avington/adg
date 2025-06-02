import { IEvent } from './event';

export interface IEventBus<E extends IEvent = IEvent> {
  /**
   * Publish one or more events to the bus.
   * @param events The events to publish.
   */
  publish(events: E | E[]): Promise<void>;
}
