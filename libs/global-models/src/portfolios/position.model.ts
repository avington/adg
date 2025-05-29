import { LotModel } from './lot.model';

export interface PositionModel {
  costBasis?: number;
  marketValue?: number;
  id?: string;
  user?: string;
  portfolioId: string;
  symbol: string;
  name?: string;
  price?: number;
  shares?: number;
  changesPercentage?: number;
  change?: number;
  dayLow?: number;
  dayHigh?: number;
  yearHigh?: number;
  yearLow?: number;
  marketCap?: number;
  priceAvg50?: number;
  priceAvg200?: number;
  exchange?: string;
  volume?: number;
  avgVolume?: number;
  open?: number;
  previousClose?: number;
  eps?: number;
  pe?: number;
  earningsAnnouncement?: Date;
  sharesOutstanding?: number;
  timestamp?: number;
  isActive?: boolean;
  realizedGains?: {
    total: { amount: number; percentage: number };
    shortTerm?: { amount: number; percentage: number };
    longTer?: { amount: number; percentage: number };
  };
  unrealizedGains?: {
    total: { amount: number; percentage: number };
    shortTerm?: { amount: number; percentage: number };
    longTerm?: { amount: number; percentage: number };
  };
  totalCostBasis?: number;
  averageCostBasis?: number;
  createdAt: Date;
  updatedAt: Date;
  lots?: LotModel[];
}
