import { IDomainEvent } from '@adg/server-shared';

export const USER_AGGREGATE_TYPE = 'User';

export const USER_CREATED_EVENT = 'UserCreatedEvent';
export interface UserCreatedPayload {
  userId: string;
  name: string;
  email: string;
  createdAt: Date;
}
export type UserCreatedEvent = IDomainEvent<UserCreatedPayload>;

export const USER_NAME_UPDATED_EVENT = 'UserNameUpdatedEvent';
export interface UserNameUpdatedPayload {
  name: string;
  updatedAt: Date;
}
export type UserNameUpdatedEvent = IDomainEvent<UserNameUpdatedPayload>;
