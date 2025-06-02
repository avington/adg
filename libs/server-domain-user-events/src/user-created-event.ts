import { Event } from '@adg/server-shared-kernel';

export interface UserCreatedPayload {
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  createdAt: Date;
}

export class UserCreatedEvent extends Event<UserCreatedPayload> {
  constructor(
    id: string,
    aggregateId: string,
    version: number,
    payload: UserCreatedPayload,
    timestamp: Date = new Date()
  ) {
    super(id, 'UserCreatedEvent', timestamp, aggregateId, version, payload);
  }
}
