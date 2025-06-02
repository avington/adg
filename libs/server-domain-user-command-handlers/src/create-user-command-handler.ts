import { CreateUserCommand } from '@adg/server-domain-user-commands';
import { UserAggregate } from '@adg/server-domain-user-aggregates';
import { IEventStore } from '@adg/server-shared-kernel';
import { IEventBus } from '@adg/server-shared-kernel';

export class CreateUserCommandHandler {
  constructor(
    private readonly eventStore: IEventStore,
    private readonly eventBus: IEventBus
  ) {}

  async execute(command: CreateUserCommand): Promise<void> {
    // 1. Load the UserAggregate from the EventStore
    const events = await this.eventStore.getEventsForAggregate(
      command.aggregateId
    );
    const aggregate = new UserAggregate(command.aggregateId);
    aggregate.loadFromHistory(events);

    // 2. Call the appropriate method on the aggregate
    aggregate.createUser(command.payload);

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
