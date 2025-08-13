import { Collection } from 'mongodb';
import { PositionCreatedEvent } from '../events/position-created-event.js';
import { v4 as uuidv4 } from 'uuid';
import { PositionOverviewModel } from '@adg/global-models';

export async function handlePositionCreatedEvent(
  event: PositionCreatedEvent,
  positionsCollection: Collection<PositionOverviewModel>
): Promise<void> {
  await positionsCollection.updateOne(
    { positionId: event.payload.positionId },
    {
      $setOnInsert: {
        positionId: event.payload.positionId || uuidv4(),
        portfolioId: event.payload.portfolioId,
        symbol: event.payload.symbol.toUpperCase(),
        userId: event.payload.userId,
        summary: { ...event.payload.summary },
        stockQuote: { ...event.payload.stockQuote },
        createdAt: event.payload.createdAt,
        updatedAt: event.payload.updatedAt,
      },
    },
    { upsert: true }
  );
}
