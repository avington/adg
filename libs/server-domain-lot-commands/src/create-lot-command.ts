import { TransactionType } from '@adg/global-models';
import { Command } from '@adg/server-shared-kernel';

export interface CreateLotPayload {
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

export class CreateLotCommand extends Command<CreateLotPayload> {
  constructor(
    id: string,
    aggregateId: string,
    payload: CreateLotPayload,
    timestamp: Date = new Date()
  ) {
    super(id, 'CreateLotCommand', timestamp, aggregateId, payload);
  }
}
