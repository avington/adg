import { Queue, QueueOptions } from 'bullmq';
import { redisConnection } from './reddis-connection.js';

// Utility to create a BullMQ Queue
export function createQueue<T = any>(
  name: string,
  options?: Partial<QueueOptions>
): Queue<T> {
  console.log(`Creating queue: ${name}`);
  console.log('Using Redis connection:', redisConnection);
  return new Queue<T>(name, {
    connection: redisConnection,
    ...options,
  });
}
