import { LotModel } from '@adg/global-validations';
import { Event } from '@adg/server-shared-kernel';

export class LotUpdatedEvent extends Event<LotModel> {
  constructor(
    id: string,
    aggregateId: string,
    version: number,
    payload: LotModel,
    timestamp: Date = new Date()
  ) {
    super(id, 'LotUpdatedEvent', timestamp, aggregateId, version, payload);
  }
}
