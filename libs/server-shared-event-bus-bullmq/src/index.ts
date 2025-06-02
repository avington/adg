import { IEvent, IEventBus } from '@adg/server-shared-kernel';
import { Queue } from 'bullmq';
import { createQueue, QueueNames } from '@adg/server-shared-bullmq';

// Concrete BullMQ-based EventBus implementation
export class BullMqEventBus<E extends IEvent = IEvent> implements IEventBus<E> {
  private eventQueue: Queue;

  constructor(queueName: string = QueueNames.DOMAIN_EVENTS) {
    this.eventQueue = createQueue(queueName);
  }

  async publish(events: E | E[]): Promise<void> {
    const eventArray = Array.isArray(events) ? events : [events];
    for (const event of eventArray) {
      await this.eventQueue.add(event.type, event);
    }
  }
}
