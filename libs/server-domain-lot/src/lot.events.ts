import { IDomainEvent } from '@adg/server-shared';

export const POSITION_AGGREGATE_TYPE = 'Position';

export const POSITION_CREATED_EVENT = 'PositionCreatedEvent';
export interface PositionCreatedPayload {
  positionId: string;
  name: string;
  ownerEmail: string;
  createdAt: Date;
}
export type PositionCreatedEvent = IDomainEvent<PositionCreatedPayload>;

export const POSITION_NAME_UPDATED_EVENT = 'PositionNameUpdatedEvent';
export interface PositionNameUpdatedPayload {
  name: string;
  updatedAt: Date;
}
export type PositionNameUpdatedEvent = IDomainEvent<PositionNameUpdatedPayload>;
