import { gql } from '@apollo/client';

export const LOTS_BY_PORTFOLIO_AND_SYMBOL = gql`
  query LotsByPortfolioAndSymbol($portfolioId: String!, $symbol: String!) {
    lots(portfolioId: $portfolioId, symbol: $symbol) {
      id
      lotId
      symbol
      portfolioId
      shares
      price
      openDate
      transactionType
    }
  }
`;
