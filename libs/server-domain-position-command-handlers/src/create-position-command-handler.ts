import { PortfolioAggregate } from '@adg/server-domain-portfolio-aggregates';
import { PositionAggregate } from '@adg/server-domain-position-aggregates';
import { CreatePositionCommand } from '@adg/server-domain-position-commands';
import { IEventBus, IEventStore } from '@adg/server-shared-kernel';

export class CreatePositionCommandHandler {
  constructor(
    private readonly eventStore: IEventStore,
    private readonly eventBus: IEventBus
  ) {}

  async execute(command: CreatePositionCommand): Promise<void> {
    // 1. Validate Portfolio exists and user has access via Event Store
    await this.validatePortfolioAccess(
      command.payload.portfolioId,
      command.payload.userId
    );

    // 2. Load Position Aggregate (will be new, so empty events)
    const positionEvents = await this.eventStore.getEventsForAggregate(
      command.aggregateId
    );
    const positionAggregate = new PositionAggregate(command.aggregateId);
    positionAggregate.loadFromHistory(positionEvents);

    // 3. Execute business logic through aggregate
    positionAggregate.createPosition(command.payload);

    // 4. Save new events to Event Store
    const uncommittedEvents = positionAggregate.uncommittedEvents;
    await this.eventStore.saveEvents(
      positionAggregate.aggregateId,
      positionAggregate.constructor.name,
      positionAggregate.version - uncommittedEvents.length,
      uncommittedEvents
    );

    // 5. Publish events via Event Bus
    await this.eventBus.publish(uncommittedEvents);

    // 6. Mark events as committed
    positionAggregate.markEventsAsCommitted();
  }

  private async validatePortfolioAccess(
    portfolioId: string,
    userId: string
  ): Promise<void> {
    // Load portfolio aggregate from event store
    const portfolioEvents = await this.eventStore.getEventsForAggregate(
      portfolioId
    );

    if (portfolioEvents.length === 0) {
      throw new Error(`Portfolio with ID ${portfolioId} does not exist`);
    }

    // Reconstruct portfolio aggregate from events
    const portfolioAggregate = new PortfolioAggregate(portfolioId);
    portfolioAggregate.loadFromHistory(portfolioEvents);

    // Validate through domain logic
    if (!portfolioAggregate.isOwnedBy(userId)) {
      throw new Error(
        `User ${userId} does not have access to portfolio ${portfolioId}`
      );
    }

    if (!portfolioAggregate.isActive()) {
      throw new Error(`Portfolio ${portfolioId} is not active`);
    }
  }
}
