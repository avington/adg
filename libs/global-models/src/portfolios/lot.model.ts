import { HoldingPeriodsType } from './holding-periods.type';

export type TransactionType = 'BUY' | 'SELL';

export interface LotModel {
  openDate: Date | string;
  id?: string;
  symbol: string;
  portfolioId: string;
  user?: string;
  transactionType: TransactionType;
  shares: number;
  costPerShare: number;
  costBasis?: number;
  price?: number;
  marketValue?: number;
  holdingPeriod?: HoldingPeriodsType;
  gainsLosses?: number;
  gainsLossesPercentage?: number;
  createdAt?: Date;
  updatedAt?: Date;
}
