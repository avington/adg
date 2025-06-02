import { Event } from '@adg/server-shared-kernel';

export interface UserNameUpdatedPayload {
  userId: string;
  firstName: string;
  lastName: string;
  updatedAt: Date;
}

export class UserNameUpdatedEvent extends Event<UserNameUpdatedPayload> {
  constructor(
    id: string,
    aggregateId: string,
    version: number,
    payload: UserNameUpdatedPayload,
    timestamp: Date = new Date()
  ) {
    super(id, 'UserNameUpdatedEvent', timestamp, aggregateId, version, payload);
  }
}
