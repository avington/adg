import { AggregateRoot } from '@adg/server-shared-kernel';
import { PositionOverviewModel } from '@adg/global-models';
import { PositionCreatedEvent } from '@adg/server-domain-position-events';
import { v4 as uuid } from 'uuid';

export class PositionAggregate extends AggregateRoot {
  private state: Partial<PositionOverviewModel> = {};

  public createPosition(data: PositionOverviewModel) {
    if (this.state.positionId) {
      throw new Error('Position already exists');
    }

    // construct the event with the provided data
    // and default values for createdAt and updatedAt if not provided
    const event = new PositionCreatedEvent(
      uuid(),
      data.positionId,
      this.version + 1,
      {
        positionId: data.positionId,
        portfolioId: data.portfolioId,
        userId: data.userId,
        symbol: data.symbol,
        summary: { ...data.summary },
        stockQuote: { ...data.stockQuote },
        createdAt: data.createdAt ?? new Date(),
        updatedAt: data.updatedAt ?? new Date(),
      }
    );

    // apply the event to update the aggregate state
    this.apply(event);
  }
}
