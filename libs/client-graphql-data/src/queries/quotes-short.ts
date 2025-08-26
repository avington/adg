import { gql } from '@apollo/client';

export const QUOTES_SHORT = gql`
  query QuotesShort($symbols: [String!]!) {
    quotesShort(symbols: $symbols) {
      symbol
      price
      change
      volume
    }
  }
`;
