import { gql } from '@apollo/client';

export const POSITION_OVERVIEWS = gql`
  query PositionOverviews($portfolioId: String!) {
    positionOverviews(portfolioId: $portfolioId) {
      id
      positionId
      portfolioId
      symbol
      summary {
        symbol
        price
        marketCap
        lastDividend
        range
        change
        changePercentage
        volume
        averageVolume
        companyName
        currency
        exchangeFullName
        exchange
        industry
      }
      stockQuote {
        price
        changePercentage
        change
        volume
        dayLow
        dayHigh
        yearHigh
        yearLow
        marketCap
        priceAvg50
        priceAvg200
        exchange
        open
        previousClose
        timestamp
      }
      lots {
        portfolioId
        positionId
        totalShares
        averagePrice
        realizedGains
        unrealizedGains
        costBasis
      }
    }
  }
`;

export const POSITION_OVERVIEW = gql`
  query PositionOverview($positionId: String!) {
    positionOverview(positionId: $positionId) {
      id
      positionId
      portfolioId
      symbol
      summary {
        symbol
        price
        marketCap
        lastDividend
        range
        change
        changePercentage
        volume
        averageVolume
        companyName
        currency
        exchangeFullName
        exchange
        industry
      }
      stockQuote {
        price
        changePercentage
        change
        volume
        dayLow
        dayHigh
        yearHigh
        yearLow
        marketCap
        priceAvg50
        priceAvg200
        exchange
        open
        previousClose
        timestamp
      }
      lots {
        portfolioId
        positionId
        totalShares
        averagePrice
        realizedGains
        unrealizedGains
        costBasis
      }
    }
  }
`;

export const POSITION_OVERVIEW_BY_USER_POSITION_SYMBOL = gql`
  query PositionOverviewByUserPositionSymbol(
    $positionId: String!
    $symbol: String!
  ) {
    positionOverviewByUserPositionSymbol(
      positionId: $positionId
      symbol: $symbol
    ) {
      id
      positionId
      portfolioId
      symbol
      summary {
        symbol
        price
        marketCap
        lastDividend
        range
        change
        changePercentage
        volume
        averageVolume
        companyName
        currency
        exchangeFullName
        exchange
        industry
      }
      stockQuote {
        price
        changePercentage
        change
        volume
        dayLow
        dayHigh
        yearHigh
        yearLow
        marketCap
        priceAvg50
        priceAvg200
        exchange
        open
        previousClose
        timestamp
      }
      lots {
        portfolioId
        positionId
        totalShares
        averagePrice
        realizedGains
        unrealizedGains
        costBasis
      }
    }
  }
`;
