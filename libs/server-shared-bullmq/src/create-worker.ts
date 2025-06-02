import { Worker, WorkerOptions } from 'bullmq';
import { redisConnection } from './reddis-connection';

// Utility to create a BullMQ Worker
export function createWorker<T = any>(
  name: string,
  processor: string | ((job: any) => Promise<any> | any),
  options?: Partial<WorkerOptions>
): Worker<T> {
  return new Worker<T>(name, processor, {
    connection: redisConnection,
    ...options,
  });
}
