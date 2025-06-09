import { TransactionType } from '@adg/global-models';

export interface LotProjection {
  _id?: string; // MongoDB ObjectId
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
export interface LotsProjection {
  lots: LotProjection[];
  totalCount: number;
}
