import { Event } from '@adg/server-shared-kernel';
import { TransactionType } from '@adg/global-models';

export interface LotCreatedPayload {
  lotId?: string;
  symbol: string;
  portfolioId: string;
  userId?: string;
  transactionType: TransactionType;
  shares: number;
  price?: number;
  openDate: Date;
  createdAt?: Date;
  updatedAt?: Date;
  lastUpdatedBy?: string;
}
export class LotCreatedEvent extends Event<LotCreatedPayload> {
  constructor(
    id: string,
    aggregateId: string,
    version: number,
    payload: LotCreatedPayload,
    timestamp: Date = new Date()
  ) {
    super(id, 'LotCreatedEvent', timestamp, aggregateId, version, payload);
  }
}
