// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface IDomainEvent<T = any> {
  readonly aggregateId: string;
  readonly aggregateType: string;
  readonly eventType: string;
  readonly version: number;
  readonly payload: T;
  readonly timestamp: Date;
}
