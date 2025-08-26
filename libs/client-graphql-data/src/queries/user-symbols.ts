import { gql } from '@apollo/client';

export const USER_SYMBOLS = gql`
  query UserSymbols {
    userSymbols
  }
`;
