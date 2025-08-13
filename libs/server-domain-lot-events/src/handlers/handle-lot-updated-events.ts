import { Collection } from 'mongodb';
import { LotUpdatedEvent } from '../events/lot-updated-event.js';
import type { LotDoc } from '@adg/global-models';

/**
 * Handles a LotUpdatedEvent and updates the read model.
 * Ensures idempotency by upserting based on lotId.
 */
export async function handleLotUpdatedEvent(
  event: LotUpdatedEvent,
  lotCollection: Collection<LotDoc>
): Promise<void> {
  await lotCollection.updateOne(
    { lotId: event.payload.lotId },
    {
      $set: {
        symbol: event.payload.symbol.toUpperCase(),
        portfolioId: event.payload.portfolioId,
        userId: event.payload.userId,
        transactionType: event.payload.transactionType,
        shares: event.payload.shares,
        price: event.payload.price !== undefined ? event.payload.price : 0,
        openDate: event.payload.openDate,
        updatedAt: new Date(),
        lastUpdatedBy: event.payload.lastUpdatedBy || event.payload.userId,
      },
    },
    { upsert: true }
  );
}
