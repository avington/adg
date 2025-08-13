import { StockQuoteModel } from '../fmp/stock-quote.js';
import { CompanyProfileModel } from '../fmp/company-profile.js';
import { PositionLotsModel } from './position-lots.js';

export interface PositionOverviewModel {
  positionId: string;
  portfolioId: string;
  userId: string;
  symbol: string;
  summary: CompanyProfileModel;
  stockQuote: StockQuoteModel;
  lots?: PositionLotsModel; // Add this property
  createdAt: Date;
  updatedAt: Date;
}
