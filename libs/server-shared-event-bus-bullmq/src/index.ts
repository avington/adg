import { IEventBus, EventHandler } from '@adg/server-shared-kernel';
import { Queue } from 'bullmq';
import { createQueue, QueueNames } from '@adg/server-shared-bullmq';

// Concrete BullMQ-based EventBus implementation
export class BullMqEventBus<E = unknown> implements IEventBus<E> {
  private eventQueue: Queue;

  constructor(queueName: string = QueueNames.DOMAIN_EVENTS) {
    this.eventQueue = createQueue(queueName);
    // Basic diagnostics so queue/redis issues are visible in app logs
    this.eventQueue.on('error', (e) => {
      // Keep log concise but informative
      console.error('[BullMqEventBus] queue error:', e?.message || e);
    });
  }

  // Back/forward compatible overloads for both interface variants
  publish(events: E | E[]): Promise<void>;
  publish(events: readonly unknown[]): Promise<void>;
  async publish(events: E | E[] | readonly unknown[]): Promise<void> {
    const list = Array.isArray(events) ? [...events] : [events];
    for (const event of list) {
      const anyEvent = event as {
        type?: string;
        name?: string;
        constructor?: { name?: string };
      };
      const eventName =
        anyEvent?.type ??
        anyEvent?.name ??
        anyEvent?.constructor?.name ??
        'Event';
      await this.eventQueue.add(eventName, event as object);
    }
  }

  // No-op in an out-of-process bus; subscriptions happen in workers
  subscribe<T extends E = E>(
    _eventType: string,
    _handler: EventHandler<T>
  ): void {
    // Intentionally not implemented. Use workers/queues to consume events.
    // Mark params as used for linters without changing behavior
    void _eventType;
    void _handler;
  }

  unsubscribe<T extends E = E>(
    _eventType: string,
    _handler: EventHandler<T>
  ): void {
    // Intentionally not implemented.
    void _eventType;
    void _handler;
  }
}
