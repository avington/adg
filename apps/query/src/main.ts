import 'dotenv/config';
import express from 'express';
import morgan from 'morgan';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { loadFilesSync } from '@graphql-tools/load-files';
import { mergeResolvers } from '@graphql-tools/merge';
import type { Db } from 'mongodb';
import { MongoClient } from 'mongodb';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import cors from 'cors';
import bodyParser from 'body-parser';
import { userTypeDefs } from './graphql/types/user-types.js';
import { portfolioTypeDefs } from './graphql/types/portfolio-types.js';
import { lotTypeDef } from './graphql/types/lot-types.js';
import { positionTypeDefs } from './graphql/types/position-types.js'; // Add this import
import { googleJwtAuthMiddleware } from '@adg/server-auth';

// ES module equivalent of __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const typeDefs = [
  userTypeDefs,
  portfolioTypeDefs,
  lotTypeDef,
  positionTypeDefs,
]; // Add positionTypeDefs here

// Loads all resolver files (*.resolvers.ts or *.resolvers.js) in this directory and subdirectories
const resolversArray = loadFilesSync(join(__dirname, './**/*.resolvers.js'));
const resolvers = mergeResolvers(resolversArray);

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017';
const DB_NAME = process.env.READ_MODEL_DB_NAME || 'adg_read_model_db';
console.log(
  '[query] READ_MODEL_DB_NAME =',
  process.env.READ_MODEL_DB_NAME,
  ' -> using',
  DB_NAME
);
const IS_PRODUCTION = process.env.NODE_ENV === 'production';
const CLIENT_DOMAIN = process.env.CLIENT_DOMAIN || 'http://localhost:4200';
// Set BYPASS_AUTH=true in your environment to skip authentication for development/testing
const BYPASS_AUTH = process.env.BYPASS_AUTH === 'true';

async function start() {
  // Connect to MongoDB
  const client = new MongoClient(MONGO_URI);
  await client.connect();
  const db = client.db(DB_NAME);

  // Log authentication status
  if (BYPASS_AUTH) {
    console.log('⚠️  Authentication is BYPASSED for development/testing');
    console.log(
      '⚠️  GraphQL Playground will work without authentication tokens'
    );
  } else {
    console.log(
      '🔒 Authentication is REQUIRED - tokens needed for GraphQL requests'
    );
  }

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

  // Add Google Auth middleware BEFORE Apollo middleware
  app.use('/graphql', googleJwtAuthMiddleware);

  // Mount Apollo Server middleware
  app.use(
    '/graphql',
    expressMiddleware(server, {
      context: async ({
        req,
      }: {
        req: express.Request & { user?: unknown };
      }) => ({ db, user: req.user }),
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
