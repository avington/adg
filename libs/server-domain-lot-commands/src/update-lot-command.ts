import { Command } from '@adg/server-shared-kernel';
import { TransactionType } from '@adg/global-models';

export interface UpdateLotPayload {
  lotId: string;
  symbol: string;
  portfolioId: string;
  userId: string;
  transactionType: TransactionType;
  shares: number;
  price: number;
  openDate: Date;
  updatedAt?: Date;
  lastUpdatedBy?: string;
}

export class UpdateLotCommand extends Command<UpdateLotPayload> {
  constructor(
    id: string,
    aggregateId: string,
    payload: UpdateLotPayload,
    timestamp: Date = new Date()
  ) {
    super(id, 'UpdateLotCommand', timestamp, aggregateId, payload);
  }
}
