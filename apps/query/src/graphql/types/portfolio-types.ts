import { gql } from 'apollo-server-core';

export const portfolioTypeDefs = gql`
  type Portfolio {
    id: ID!
    portfolioId: String
    userId: String
    name: String!
    description: String
    createdAt: String
    updatedAt: String
  }

  type Query {
    portfolios: [Portfolio!]!
    portfolio(id: ID!): Portfolio
  }
`;
