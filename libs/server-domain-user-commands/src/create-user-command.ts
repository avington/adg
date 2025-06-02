import { Command } from '@adg/server-shared-kernel';

export interface CreateUserPayload {
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  fullName?: string;
  createdAt?: Date;
}

export class CreateUserCommand extends Command<CreateUserPayload> {
  constructor(
    id: string,
    aggregateId: string,
    payload: CreateUserPayload,
    timestamp: Date = new Date()
  ) {
    super(id, 'CreateUserCommand', timestamp, aggregateId, payload);
  }
}
