import { gql } from '@apollo/client';

export const USER_HOLDINGS_SYMBOLS_BY_PORTFOLIO = gql`
  query UserHoldingsSymbolsByPortfolio {
    userHoldingsSymbolsByPortfolio {
      portfolioId
      portfolioName
      symbols
    }
  }
`;
