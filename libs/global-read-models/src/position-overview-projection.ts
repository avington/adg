export interface PositionOverviewProjection {
  _id?: string; // MongoDB ObjectId
  positionId: string;
  portfolioId: string;
  symbol: string;
  summary: {
    symbol: string;
    price: number;
    marketCap: number;
    lastDividend: number;
    range: string;
    change: number;
    changePercentage: number;
    volume: number;
    averageVolume: number;
    companyName: string;
    currency: string;
    exchangeFullName: string;
    exchange: string;
    industry: string;
  };
  stockQuote: {
    price: number;
    changePercentage: number;
    change: number;
    volume: number;
    dayLow: number;
    dayHigh: number;
    yearHigh: number;
    yearLow: number;
    marketCap: number;
    priceAvg50: number;
    priceAvg200: number;
    exchange: string;
    open: number;
    previousClose: number;
    timestamp: number;
  };
  lots: {
    portfolioId: string;
    positionId: string;
    totalShares: number;
    averagePrice: number;
    realizedGains: number;
    unrealizedGains: number;
    costBasis: number;
    // Add any other fields related to lots here
  };
}
