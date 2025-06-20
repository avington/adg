import { IEventStore, IEventBus } from '@adg/server-shared-kernel';
import { LotAggregate } from '@adg/server-domain-lot-aggregates';
import { CreateLotCommand } from '@adg/server-domain-lot-commands';

export class CreateLotCommandHandler {
  constructor(
    private readonly eventStore: IEventStore,
    private readonly eventBus: IEventBus
  ) {}

  async execute(command: CreateLotCommand): Promise<void> {
    // 1. Load the LotAggregate from the EventStore
    const events = await this.eventStore.getEventsForAggregate(
      command.aggregateId
    );
    const aggregate = new LotAggregate(command.aggregateId);
    aggregate.loadFromHistory(events);

    // 2. Call the appropriate method on the aggregate
    aggregate.createLot(command.payload);

    // 3. Save the new events from the aggregate back to the EventStore
    const uncommittedEvents = aggregate.uncommittedEvents;
    await this.eventStore.saveEvents(
      aggregate.aggregateId,
      aggregate.constructor.name,
      aggregate.version - uncommittedEvents.length,
      uncommittedEvents
    );

    // 4. Publish the new events via the EventBus
    // Use a logger to log publishing events
    // logger.info('Publishing events:', uncommittedEvents);
    await this.eventBus.publish(uncommittedEvents);

    // 5. Mark events as committed
    aggregate.markEventsAsCommitted();
  }
}
