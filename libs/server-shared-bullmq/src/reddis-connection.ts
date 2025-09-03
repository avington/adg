import { ConnectionOptions } from 'bullmq';

// Centralized Redis connection options
export const redisConnection: ConnectionOptions = {
  host: process.env.REDIS_HOST || 'localhost',
  port: Number(process.env.REDIS_PORT) || 6379,

  // backoff to reduce reconnect spam
  retryStrategy: (times) => Math.min(1000 + times * 500, 5000),

  // recommended for BullMQ/ioredis in workers
  maxRetriesPerRequest: null,
  enableReadyCheck: false,

  // fewer noisy hard failures on transient errors
  reconnectOnError: (err) =>
    /READONLY|ETIMEDOUT|ECONNRESET|EAI_AGAIN/i.test(err.message) ? true : false,

  // optional timeouts
  connectTimeout: 10000,
  keepAlive: 1,
};
