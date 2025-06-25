import { gql } from '@apollo/client';

export const PORTFOLIO_BY_USER = gql`
  query PortfolioByUser {
    portfolios {
      portfolioId
      name
      description
    }
  }
`;
