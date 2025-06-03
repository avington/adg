import { Collection, Document } from 'mongodb';
import { PortfolioUpdatedEvent } from '../events/portfolio-updated-event';

/**
 * Handles a PortfolioUpdatedEvent and updates the portfolio read model.
 * Ensures idempotency by upserting based on portfolioId.
 */
export async function handlePortfolioUpdatedEvent(
  event: PortfolioUpdatedEvent,
  portfoliosCollection: Collection<Document>
): Promise<void> {
  // Use portfolioId as the unique identifier for idempotency
  await portfoliosCollection.updateOne(
    { portfolioId: event.payload.portfolioId },
    {
      $set: {
        userId: event.payload.userId,
        name: event.payload.name,
        description: event.payload.description,
        updatedAt: event.payload.updatedAt || new Date(),
      },
    },
    { upsert: true }
  );
}
