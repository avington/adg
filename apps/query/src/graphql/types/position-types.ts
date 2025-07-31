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

  type PositionOverview {
    id: ID!
    positionId: String!
    portfolioId: String!
    symbol: String!
    summary: CompanySummary!
    stockQuote: StockQuote!
  }

  extend type Query {
    positionOverviews(portfolioId: String!): [PositionOverview!]!
    positionOverview(positionId: String!): PositionOverview
  }
`;
