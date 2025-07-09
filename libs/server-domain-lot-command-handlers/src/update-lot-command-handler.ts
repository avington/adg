import { IEventBus, IEventStore } from '@adg/server-shared-kernel';
import { UpdateLotCommand } from '@adg/server-domain-lot-commands';
import { LotAggregate } from '@adg/server-domain-lot-aggregates';

export class UpdateLotCommandHandler {
  constructor(
    private readonly eventStore: IEventStore,
    private readonly eventBus: IEventBus
  ) {}

  async execute(command: UpdateLotCommand): Promise<void> {
    // 1. Load the LotAggregate from the EventStore
    const events = await this.eventStore.getEventsForAggregate(
      command.aggregateId
    );
    const aggregate = new LotAggregate(command.aggregateId);
    aggregate.loadFromHistory(events);

    // 2. Call the appropriate method on the aggregate
    aggregate.updateLot(command.payload);

    // 3. Save the new events from the aggregate back to the EventStore
    const uncommittedEvents = aggregate.uncommittedEvents;
    await this.eventStore.saveEvents(
      aggregate.aggregateId,
      aggregate.constructor.name,
      aggregate.version - uncommittedEvents.length,
      uncommittedEvents
    );

    // 4. Publish the new events via the EventBus
    await this.eventBus.publish(uncommittedEvents);

    // 5. Mark events as committed
    aggregate.markEventsAsCommitted();
  }
}
