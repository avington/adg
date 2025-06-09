import { TransactionType } from '@adg/global-models';
import { Event } from '@adg/server-shared-kernel';

export interface LotUpdatedPayload {
  lotId: string;
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
export class LotUpdatedEvent extends Event<LotUpdatedPayload> {
  constructor(
    id: string,
    aggregateId: string,
    version: number,
    payload: LotUpdatedPayload,
    timestamp: Date = new Date()
  ) {
    super(id, 'LotUpdatedEvent', timestamp, aggregateId, version, payload);
  }
}
