import { IEventBus, EventHandler } from './event-bus.js';

type EventWithOptionalNames = Partial<{
  type: string;
  name: string;
  eventType: string;
}> & { constructor: { name: string } };

export class EventBus implements IEventBus {
  private readonly eventHandlers = new Map<string, EventHandler[]>();

  async publish(events: unknown | unknown[]): Promise<void> {
    const list = Array.isArray(events) ? events : [events];

    for (const event of list) {
      const e = event as EventWithOptionalNames;
      const eventType = e.type ?? e.name ?? e.eventType ?? e.constructor.name;
      const handlers = this.eventHandlers.get(eventType) ?? [];

      await Promise.all(
        handlers.map((handler, idx) =>
          handler(event).catch((error) => {
            const handlerName = handler.name || '<anonymous>';
            console.error(
              `Error in event handler for ${eventType} (handler #${idx}, function: ${handlerName}):`,
              error
            );
          })
        )
      );
    }
  }

  subscribe<T = unknown>(eventType: string, handler: EventHandler<T>): void {
    if (!this.eventHandlers.has(eventType)) {
      this.eventHandlers.set(eventType, []);
    }
    const handlers = this.eventHandlers.get(eventType);
    if (handlers) {
      handlers.push(handler as EventHandler);
    }
  }

  unsubscribe<T = unknown>(eventType: string, handler: EventHandler<T>): void {
    const handlers = this.eventHandlers.get(eventType);
    if (!handlers) return;
    const index = handlers.indexOf(handler as EventHandler);
    if (index > -1) {
      handlers.splice(index, 1);
    }
  }
}
