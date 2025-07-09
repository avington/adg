import { Collection, Document } from 'mongodb';
import { LotCreatedEvent } from '../events/lot-created-event.js';

export async function handleLotCreatedEvent(
  event: LotCreatedEvent,
  lotCollection: Collection<Document>
): Promise<void> {
  // Log the event using a structured logger (replace `logger` with your logging library instance)
  // logger.info('Handling LotCreatedEvent', { event });
  // Use portfolioId as the unique identifier for idempotency
  await lotCollection.updateOne(
    { lotId: event.payload.lotId },
    {
      $setOnInsert: {
        lotId: event.payload.lotId, // <-- Use the event's lotId
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
