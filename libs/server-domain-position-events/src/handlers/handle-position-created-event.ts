import { Collection, Document } from 'mongodb';
import { PositionCreatedEvent } from 'src/events/position-created-event';
import { v4 as uuidv4 } from 'uuid';

export async function handlePositionCreatedEvent(
  event: PositionCreatedEvent,
  positionsCollection: Collection<Document>
): Promise<void> {
  // Handle the event (e.g., save the position to the database)
  await positionsCollection.updateOne(
    { positionId: event.payload.positionId },
    {
      $setOnInsert: {
        positionId: event.payload.positionId || uuidv4(), // Generate a new ID if not provided
        portfolioId: event.payload.portfolioId,
        symbol: event.payload.symbol,
        userId: event.payload.userId,
        summary: { ...event.payload.summary },
        stockQuote: { ...event.payload.stockQuote },
      },
    }
  );
}
