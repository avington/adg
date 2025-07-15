import { PositionModel } from './position.model.js';

export interface PortfolioModel {
  id?: string;
  user: string;
  name: string;
  description?: string;
  createdAt?: Date;
  updatedAt?: Date;
  isActive?: boolean;
  totalSymbols?: number;
  totalCostBasis?: number;
  averageCostBasis?: number;
  dayChange?: {
    amount: number;
    percentage: number;
  };
  totalMarketValue?: number;
  cashHoldings?: number;
  realizedGains?: {
    total: { amount: number; percentage: number };
    shortTerm: { amount: number; percentage: number };
    longTerm: { amount: number; percentage: number };
  };
  unrealizedGains?: {
    total: { amount: number; percentage: number };
    shortTerm: { amount: number; percentage: number };
    longTerm: { amount: number; percentage: number };
  };
  positions?: PositionModel[];
}
