import { TransactionType } from '@adg/global-validations';

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
  /**
   * The average price per share across all lots.
   * Calculated as the total cost divided by the total number of shares.
   */
  averagePrice: number;
  /**
   * The total number of shares aggregated from all lots.
   */
  totalShares: number;
}
