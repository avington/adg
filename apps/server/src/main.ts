// Description: Main entry point for the server application,
// setting up middleware, routes, and starting the server.
import express from 'express';
import * as path from 'path';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';
import mongoSanitize from 'express-mongo-sanitize';
import { googleJwtAuthMiddleware, authRouter } from '@adg/server-auth';
import userRouter from './routes/user-routes';
import { BullMqEventBus } from '@adg/server-shared-event-bus-bullmq';
import { MongoEventStore } from '@adg/server-shared-event-store';
import { ExpressAdapter } from '@bull-board/express';
import { createBullBoard } from '@bull-board/api';
import { BullMQAdapter } from '@bull-board/api/bullMQAdapter';
import { Queue } from 'bullmq';
import { QueueNames, redisConnection } from '@adg/server-shared-bullmq';
import { portfolioRouter } from './routes/portfolio-routes';
import { lotsRouter } from './routes/lots-routes';
import { positionsRouter } from './routes/position-routes';

const clientDomain = process.env.CLIENT_DOMAIN || 'http://localhost:3000';
const app = express();

// Middleware to enable CORS
app.use(
  cors({
    origin: clientDomain,
  })
);
// Middleware for security headers
app.use(helmet());

// Middleware to parse JSON bodies
app.use(express.json());

// Middleware for logging requests
const dev = process.env.NODE_ENV !== 'production';
if (dev) {
  app.use(morgan('combined'));
}

// Middleware to sanitize user input
app.use(mongoSanitize());

// deployed static assets
app.use('/assets', express.static(path.join(__dirname, 'assets')));

app.get('/api', (req, res) => {
  res.send({ message: 'Welcome to server!' });
});

app.use('/api/v1/auth', googleJwtAuthMiddleware, authRouter);

const eventBus = new BullMqEventBus();
const eventStore = new MongoEventStore(
  process.env.MONGO_URI || 'mongodb://localhost:27017',
  process.env.EVENT_STORE_DB || 'adg_event_store_db'
);

async function start() {
  // Connect to MongoDB for event store
  await eventStore.connect();

  // Route for event store connections
  app.use('/api/v1/user', userRouter(eventStore, eventBus));
  app.use('/api/v1/portfolios', portfolioRouter(eventStore, eventBus));
  app.use('/api/v1/lots', lotsRouter(eventStore, eventBus));
  app.use('/api/v1/positions', positionsRouter(eventStore, eventBus));

  // Example: create a BullMQ queue instance (replace with your actual queue)
  const userEventsQueue = new Queue(QueueNames.DOMAIN_EVENTS, {
    connection: redisConnection,
  });

  // Set up Bull Board dashboard
  const serverAdapter = new ExpressAdapter();
  serverAdapter.setBasePath('/admin/queues');
  createBullBoard({
    queues: [new BullMQAdapter(userEventsQueue)],
    serverAdapter,
  });
  app.use('/admin/queues', serverAdapter.getRouter());

  const port = process.env.SERVER_PORT || 3333;
  const server = app.listen(port, () => {
    console.log(`Listening at http://localhost:${port}/api`);
  });
  server.on('error', console.error);
}

start();
