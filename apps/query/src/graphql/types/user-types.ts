import { gql } from 'apollo-server-core';

export const userTypeDefs = gql`
  type User {
    id: ID!
    userId: String!
    username: String!
    firstName: String!
    lastName: String!
    email: String!
    createdAt: String!
    updatedAt: String
  }

  type Query {
    user(id: ID!): User
    users: [User!]!
  }
`;
