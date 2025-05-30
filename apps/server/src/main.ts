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
app.use('/api/v1/user', googleJwtAuthMiddleware, userRouter);

const port = process.env.PORT || 3333;
const server = app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}/api`);
});
server.on('error', console.error);
