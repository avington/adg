import { Collection, Document } from 'mongodb';
import { LotUpdatedEvent } from '../events/lot-updated-event';

/**
 * Handles a LotUpdatedEvent and updates the portfolio read model.
 * Ensures idempotency by upserting based on portfolioId.
 */
export async function handleLotUpdatedEvent(
  event: LotUpdatedEvent,
  portfoliosCollection: Collection<Document>
): Promise<void> {
  // Use lotId as the unique identifier for idempotency
  await portfoliosCollection.updateOne(
    { lotId: event.payload.lotId },
    {
      $set: {
        symbol: event.payload.symbol,
        portfolioId: event.payload.portfolioId,
        userId: event.payload.userId,
        transactionType: event.payload.transactionType,
        shares: event.payload.shares,
        price: event.payload.price,
        openDate: event.payload.openDate,
        updatedAt: new Date(),
        lastUpdatedBy: event.payload.lastUpdatedBy || event.payload.userId, // Default to userId if not provided
      },
    },
    { upsert: true }
  );
}
