import { ConnectionOptions } from 'bullmq';

// Centralized Redis connection options
export const redisConnection: ConnectionOptions = {
  host: process.env.REDIS_HOST || 'localhost',
  port: Number(process.env.REDIS_PORT) || 6379,
  // Add more options as needed (password, db, etc.)
};
