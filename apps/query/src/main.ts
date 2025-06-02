import express from 'express';
import morgan from 'morgan';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { loadFilesSync } from '@graphql-tools/load-files';
import { mergeResolvers } from '@graphql-tools/merge';
import type { Db } from 'mongodb';
import { MongoClient } from 'mongodb';
import path from 'path';
import cors from 'cors';
import bodyParser from 'body-parser';
import { userTypeDefs } from './graphql/types/user-types';

const typeDefs = [userTypeDefs];

// Loads all resolver files (*.resolvers.ts or *.resolvers.js) in this directory and subdirectories
const resolversArray = loadFilesSync(
  path.join(__dirname, './**/*.resolvers.{ts,js}')
);
const resolvers = mergeResolvers(resolversArray);

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017';
const DB_NAME = process.env.READ_MODEL_DB_NAME || 'readmodel';
const IS_PRODUCTION = process.env.NODE_ENV === 'production';
const CLIENT_DOMAIN = process.env.CLIENT_DOMAIN || 'http://localhost:4200';

async function start() {
  // Connect to MongoDB
  const client = new MongoClient(MONGO_URI);
  await client.connect();
  const db = client.db(DB_NAME);

  // Create Apollo Server
  const server = new ApolloServer<{ db: Db }>({
    typeDefs,
    resolvers,
  });
  await server.start();

  // Create Express app
  const app = express();

  // Add logging middleware
  if (!IS_PRODUCTION) {
    app.use(morgan('combined'));
  }

  // Add CORS and body parser middleware
  app.use(cors({ origin: CLIENT_DOMAIN, credentials: true }));
  app.use(bodyParser.json());

  // Mount Apollo Server middleware
  app.use(
    '/graphql',
    expressMiddleware(server, {
      context: async () => ({ db }),
    })
  );

  app.listen(4000, () => {
    console.log(`🚀 Apollo Server ready at http://localhost:4000/graphql`);
  });
}

start().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
