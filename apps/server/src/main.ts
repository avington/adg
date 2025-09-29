// Description: Main entry point for the server application,
// setting up middleware, routes, and starting the server.
import 'dotenv/config';
// Register diagnostics (must be first after dotenv)
import { registerProcessDiagnostics } from '@adg/server-shared-kernel';
registerProcessDiagnostics({ serviceName: 'write-api' });
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

// Support multiple origins via comma-separated env; include common dev defaults
const clientDomains = (
  process.env.CLIENT_DOMAIN || 'http://localhost:4200,http://localhost:3000'
)
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean);
const app = express();
const DEBUG_HTTP = process.env.DEBUG_HTTP === 'true';

// Ultra-early diagnostic logger (before CORS & body parsing) to trace connection vs auth issues
app.use((req, _res, next) => {
  // Keep lightweight; avoid logging large headers
  const origin = req.headers.origin;
  const hasAuth = !!req.headers.authorization;
  console.log(
    `[early] ${req.method} ${req.originalUrl || req.url} origin=${
      origin || 'n/a'
    } auth=${hasAuth ? 'y' : 'n'}`
  );
  next();
});

// Middleware to enable CORS (robust for local dev and preflight)
const corsOptions: cors.CorsOptions = {
  origin: (origin, callback) => {
    // Allow requests without origin (mobile apps, curl)
    if (!origin) return callback(null, true);
    try {
      const u = new URL(origin);
      const isLocalHost =
        u.hostname === 'localhost' || u.hostname === '127.0.0.1';
      if (isLocalHost) return callback(null, true);
      if (clientDomains.includes(origin)) return callback(null, true);
    } catch {
      // If origin is malformed, deny CORS for safety
    }
    // Do not error—just indicate CORS not allowed
    return callback(null, false);
  },
  credentials: true,
  methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'X-Requested-With',
    'Accept',
    'Origin',
  ],
  optionsSuccessStatus: 204,
  preflightContinue: false,
};
app.use(cors(corsOptions));
// Explicitly handle OPTIONS for all routes (some proxies require this)
app.options('*', cors(corsOptions));

// Very-early request tracer (before JSON parsing or other middleware)
if (DEBUG_HTTP) {
  app.use((req, _res, next) => {
    // Keep it compact to avoid spam
    console.log(`[HTTP] -> ${req.method} ${req.originalUrl || req.url}`);
    next();
  });
}
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

// Simple health endpoint
app.get('/healthz', (_req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Simple diagnostic echo (no auth) to verify connectivity & headers
app.get('/diag/echo', (req, res) => {
  res.json({
    ok: true,
    method: req.method,
    url: req.originalUrl || req.url,
    origin: req.headers.origin || null,
    hasAuth: !!req.headers.authorization,
    time: new Date().toISOString(),
  });
});

app.use('/api/v1/auth', googleJwtAuthMiddleware, authRouter);

// Prefer EVENT_STORE_DB, but also support EVENT_STORE_DB_NAME for compatibility
const EVENT_STORE_DB_NAME =
  process.env.EVENT_STORE_DB ||
  process.env.EVENT_STORE_DB_NAME ||
  'adg_event_store_db';

const eventStore = new MongoEventStore(
  process.env.MONGO_URI || 'mongodb://localhost:27017',
  EVENT_STORE_DB_NAME
);

async function start() {
  // Surface crashes that might be causing restarts without useful logs
  process.on('uncaughtException', (err) => {
    console.error('Uncaught Exception:', err);
  });
  process.on('unhandledRejection', (reason) => {
    console.error('Unhandled Rejection:', reason);
  });

  // Connect to MongoDB for event store
  console.log('Initializing event store connection...');
  try {
    await eventStore.connect();
    console.log(`Connected to event store DB: ${EVENT_STORE_DB_NAME}`);
  } catch (err) {
    console.error('Failed to connect to MongoDB event store.');
    console.error(
      'MONGO_URI:',
      process.env.MONGO_URI || 'mongodb://localhost:27017'
    );
    console.error('EVENT_STORE_DB / EVENT_STORE_DB_NAME:', EVENT_STORE_DB_NAME);
    console.error(err);
    // Exit so Nx shows the error instead of silently looping
    process.exit(1);
  }

  // Initialize event bus (BullMQ) after DB connect so we can see DB logs first
  let eventBus: BullMqEventBus;
  try {
    eventBus = new BullMqEventBus();
    console.log('Event bus initialized (BullMQ).');
  } catch (err) {
    console.error('Failed to initialize BullMQ event bus:', err);
    // Exit so Nx shows the error
    process.exit(1);
    return; // for type narrowing
  }

  // Route for event store connections
  const userRoute = '/api/v1/user';
  const portfolioRoute = '/api/v1/portfolios';
  const lotsRoute = '/api/v1/lots';
  const positionsRoute = '/api/v1/positions';

  console.log('Setting up routes...');
  console.log(`User route: ${userRoute}`);
  console.log(`Portfolio route: ${portfolioRoute}`);
  console.log(`Lots route: ${lotsRoute}`);
  console.log(`Positions route: ${positionsRoute}`);

  app.use(userRoute, userRouter(eventStore, eventBus));
  app.use(portfolioRoute, portfolioRouter(eventStore, eventBus));
  app.use(lotsRoute, lotsRouter(eventStore, eventBus));
  app.use(positionsRoute, positionsRouter(eventStore, eventBus));

  // Example: create a BullMQ queue instance (replace with your actual queue)
  let userEventsQueue: Queue | undefined;
  try {
    userEventsQueue = new Queue(QueueNames.DOMAIN_EVENTS, {
      connection: redisConnection,
    });
    userEventsQueue.on('error', (e) =>
      console.error('BullMQ queue error (DOMAIN_EVENTS):', e)
    );
  } catch (err) {
    console.error('Failed to create BullMQ queue (DOMAIN_EVENTS):', err);
    // Continue without Bull Board if queue cannot be created
  }

  // Set up Bull Board dashboard
  const serverAdapter = new ExpressAdapter();
  serverAdapter.setBasePath('/admin/queues');
  if (userEventsQueue) {
    createBullBoard({
      queues: [new BullMQAdapter(userEventsQueue)],
      serverAdapter,
    });
  }
  app.use('/admin/queues', serverAdapter.getRouter());

  // 404 handler (after all routes)
  app.use((req, res) => {
    res.status(404).json({ error: 'Not Found', path: req.path });
  });

  // Error handler (must have 4 args to be recognized by Express)
  app.use(
    (
      err: unknown,
      _req: express.Request,
      res: express.Response,
      _next: express.NextFunction // eslint-disable-line @typescript-eslint/no-unused-vars -- required to keep 4-arg error handler signature
    ) => {
      console.error('Unhandled error:', err);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  );

  const port = Number(process.env.SERVER_PORT) || 3333;
  const requestedHost = process.env.SERVER_HOST;
  // Fallback: if host is unspecified or IPv6 '::', bind to 0.0.0.0 for wider compatibility on Windows
  const host =
    !requestedHost || requestedHost === '::' ? '0.0.0.0' : requestedHost;
  const server = app.listen(port, host, () => {
    const displayHost = host === '0.0.0.0' ? 'localhost' : host;
    console.log('[startup] Requested host =', requestedHost || '(none)');
    console.log('[startup] Effective bind host =', host);
    console.log('[startup] API base URL:', `http://${displayHost}:${port}/api`);
    console.log(
      '[startup] Health URL:',
      `http://${displayHost}:${port}/healthz`
    );
    console.log(`Listening at http://${displayHost}:${port}/api`);
  });
  server.on('error', console.error);
  // Gracefully handle low-level client errors (avoid connection resets without logs)
  server.on('clientError', (err, socket) => {
    console.error('HTTP client error:', err);
    try {
      socket.end('HTTP/1.1 400 Bad Request\r\n\r\n');
    } catch (e) {
      console.error('Failed to end socket after clientError:', e);
    }
  });
}

start();
