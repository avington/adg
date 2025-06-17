import { gql } from 'apollo-server-core';

export const lotTypeDef = gql`
  type Lot {
    id: ID!
    lotId: String
    symbol: String!
    portfolioId: String!
    userId: String
    transactionType: String!
    shares: Float!
    price: Float
    openDate: String
    createdAt: String
    updatedAt: String
    lastUpdatedBy: String
  }

  type Query {
    lots(portfolioId: String, symbol: String): [Lot!]!
    lot(id: ID!): Lot
  }
`;
