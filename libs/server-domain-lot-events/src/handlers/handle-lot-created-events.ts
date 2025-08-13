import { Collection } from 'mongodb';
import { LotCreatedEvent } from '../events/lot-created-event.js';
import type { LotDoc } from '@adg/global-models';

export async function handleLotCreatedEvent(
  event: LotCreatedEvent,
  lotCollection: Collection<LotDoc>
): Promise<void> {
  await lotCollection.updateOne(
    { lotId: event.payload.lotId },
    {
      $setOnInsert: {
        lotId: event.payload.lotId,
        symbol: event.payload.symbol.toUpperCase(),
        portfolioId: event.payload.portfolioId,
        userId: event.payload.userId,
        transactionType: event.payload.transactionType,
        shares: event.payload.shares,
        price: event.payload.price !== undefined ? event.payload.price : 0,
        openDate: event.payload.openDate,
        createdAt: event.payload.createdAt || new Date(),
        updatedAt: event.payload.updatedAt || new Date(),
        lastUpdatedBy: event.payload.lastUpdatedBy || event.payload.userId,
      },
    },
    { upsert: true }
  );
}
