import { StockQuoteModel } from '../fmp/stock-quote.js';
import { CompanyProfileModel } from '../fmp/company-profile.js';

export interface PositionOverviewModel {
  positionId: string;
  portfolioId: string;
  userId: string;
  symbol: string;
  summary: CompanyProfileModel;
  stockQuote: StockQuoteModel;
  createdAt: Date;
  updatedAt: Date;
}
