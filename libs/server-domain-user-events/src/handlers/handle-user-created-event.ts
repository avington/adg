import type { Collection, Document } from 'mongodb';
import type { UserCreatedEvent } from '../events/user-created-event.js';

/**
 * Handles a UserCreatedEvent and updates/inserts into the user read model.
 * Ensures idempotency by upserting based on userId.
 */
export async function handleUserCreatedEvent(
  event: UserCreatedEvent,
  usersCollection: Collection<Document>
): Promise<void> {
  // Use userId as the unique identifier for idempotency
  await usersCollection.updateOne(
    { userId: event.payload.userId },
    {
      $setOnInsert: {
        userId: event.payload.userId,
        firstName: event.payload.firstName,
        lastName: event.payload.lastName,
        email: event.payload.email,
        createdAt: event.payload.createdAt,
        updatedAt: event.payload.createdAt,
      },
    },
    { upsert: true }
  );
}
