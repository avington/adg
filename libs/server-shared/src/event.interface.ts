import { DomainTypes } from '@adg/global-models';

export interface IDomainEvent<T = DomainTypes> {
  readonly aggregateId: string;
  readonly aggregateType: string;
  readonly eventType: string;
  readonly version: number;
  readonly payload: T;
  readonly timestamp: Date;
}
