import { gql } from 'apollo-server-core';

export const positionTypeDefs = gql`
  type CompanySummary {
    symbol: String!
    price: Float!
    marketCap: Float!
    lastDividend: Float!
    range: String!
    change: Float!
    changePercentage: Float!
    volume: Int!
    averageVolume: Int!
    companyName: String!
    currency: String!
    exchangeFullName: String!
    exchange: String!
    industry: String!
  }

  type StockQuote {
    price: Float!
    changePercentage: Float!
    change: Float!
    volume: Int!
    dayLow: Float!
    dayHigh: Float!
    yearHigh: Float!
    yearLow: Float!
    marketCap: Float!
    priceAvg50: Float!
    priceAvg200: Float!
    exchange: String!
    open: Float!
    previousClose: Float!
    timestamp: Float!
  }

  type PositionLots {
    portfolioId: String!
    positionId: String!
    totalShares: Float!
    averagePrice: Float!
    realizedGains: Float!
    unrealizedGains: Float!
    costBasis: Float!
  }

  type PositionOverview {
    id: ID!
    positionId: String!
    portfolioId: String!
    symbol: String!
    summary: CompanySummary!
    stockQuote: StockQuote!
    lots: PositionLots
  }

  type StockQuoteShort {
    symbol: String!
    price: Float!
    change: Float!
    volume: Float!
  }

  # Grouped holdings by portfolio with symbols
  type UserHoldingsPortfolio {
    portfolioId: String!
    portfolioName: String
    symbols: [String!]!
  }

  extend type Query {
    positionOverviews(portfolioId: String!): [PositionOverview!]!
    positionOverview(positionId: String!): PositionOverview
    positionOverviewByUserPositionSymbol(
      positionId: String!
      symbol: String!
    ): PositionOverview
    userSymbols: [String!]!
    quotesShort(symbols: [String!]!): [StockQuoteShort!]!

    # NEW
    userHoldingsSymbolsByPortfolio: [UserHoldingsPortfolio!]!
  }
`;
