import { Collection, Document } from 'mongodb';
import { PortfolioCreatedEvent } from '../events/portfolio-created-event';
import { v4 as uuidv4 } from 'uuid';

export async function handlePortfolioCreatedEvent(
  event: PortfolioCreatedEvent,
  portfoliosCollection: Collection<Document>
): Promise<void> {
  // Use portfolioId as the unique identifier for idempotency
  await portfoliosCollection.updateOne(
    { portfolioId: event },
    {
      $setOnInsert: {
        portfolioId: event.payload.portfolioId || uuidv4(), // Generate a new ID if not provided
        userId: event.payload.userId,
        name: event.payload.name,
        description: event.payload.description,
        isActive: event.payload.isActive ?? true, // Default to true if not provided
        createdAt: event.payload.createdAt,
        updatedAt: event.payload.createdAt,
        lastUpdatedBy: event.payload.lastUpdatedBy || event.payload.userId, // Default to userId if not provided
      },
    },
    { upsert: true }
  );
}
