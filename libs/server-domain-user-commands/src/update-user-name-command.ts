import { Command } from '@adg/server-shared-kernel';

export interface UpdateUserNamePayload {
  userId: string;
  firstName: string;
  lastName: string;
  updatedAt?: Date;
}

export class UpdateUserNameCommand extends Command<UpdateUserNamePayload> {
  constructor(
    id: string,
    aggregateId: string,
    payload: UpdateUserNamePayload,
    timestamp: Date = new Date()
  ) {
    super(id, 'UpdateUserNameCommand', timestamp, aggregateId, payload);
  }
}
