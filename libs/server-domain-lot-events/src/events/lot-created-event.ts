import { LotModel } from '@adg/global-validations';
import { Event } from '@adg/server-shared-kernel';

export class LotCreatedEvent extends Event<LotModel> {
  constructor(
    id: string,
    aggregateId: string,
    version: number,
    payload: LotModel,
    timestamp: Date = new Date()
  ) {
    super(id, 'LotCreatedEvent', timestamp, aggregateId, version, payload);
  }
}
