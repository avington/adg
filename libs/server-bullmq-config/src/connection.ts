import { ConnectionOptions } from 'bullmq';
import * as dotenv from 'dotenv';

dotenv.config(); // Load .env file

export const redisConnection: ConnectionOptions = {
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379', 10),
};
