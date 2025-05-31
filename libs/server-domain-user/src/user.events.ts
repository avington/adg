import { UserCreatedPayload, UserNameUpdatedPayload } from '@adg/global-models';
import { IDomainEvent } from '@adg/server-shared';

export const USER_AGGREGATE_TYPE = 'User';

export const USER_CREATED_EVENT = 'UserCreatedEvent';

export type UserCreatedEvent = IDomainEvent<UserCreatedPayload>;

export const USER_NAME_UPDATED_EVENT = 'UserNameUpdatedEvent';

export type UserNameUpdatedEvent = IDomainEvent<UserNameUpdatedPayload>;
