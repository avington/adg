import { Collection, Document } from 'mongodb';
import { LotCreatedEvent } from '../events/lot-created-event';
import { v4 as uuidv4 } from 'uuid';

export async function handleLotCreatedEvent(
  event: LotCreatedEvent,
  portfoliosCollection: Collection<Document>
): Promise<void> {
  // Use portfolioId as the unique identifier for idempotency
  await portfoliosCollection.updateOne(
    { lotId: uuidv4() },
    {
      $setOnInsert: {
        lotId: uuidv4(),
        symbol: event.payload.symbol,
        portfolioId: event.payload.portfolioId,
        userId: event.payload.userId,
        transactionType: event.payload.transactionType,
        shares: event.payload.shares,
        price: event.payload.price,
        openDate: event.payload.openDate,
        createdAt: event.payload.createdAt || new Date(), // Default to current date if not provided
        updatedAt: event.payload.updatedAt || new Date(), // Default to current date if not provided
        lastUpdatedBy: event.payload.lastUpdatedBy || event.payload.userId, // Default to userId if not provided
      },
    },
    { upsert: true }
  );
}
