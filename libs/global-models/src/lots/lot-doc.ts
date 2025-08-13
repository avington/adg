export interface LotDoc {
  lotId: string;
  symbol: string;
  portfolioId: string;
  userId?: string;
  transactionType: 'BUY' | 'SELL';
  shares: number;
  price: number;
  openDate: Date;
  createdAt?: Date;
  updatedAt?: Date;
  lastUpdatedBy?: string;
  costBasis?: number;
  marketValue?: number;
  holdingPeriod?: 'SHORT_TERM' | 'LONG_TERM';
  gainsLosses?: number;
  gainsLossesPercentage?: number; // add to match downstream usage
}
