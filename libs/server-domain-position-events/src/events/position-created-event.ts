import { Event } from '@adg/server-shared-kernel';
import { PositionOverviewModel } from '@adg/global-models';

export class PositionCreatedEvent extends Event<PositionOverviewModel> {
  constructor(
    id: string,
    aggregateId: string,
    version: number,
    payload: PositionOverviewModel,
    timestamp: Date = new Date()
  ) {
    super(id, 'PositionCreatedEvent', timestamp, aggregateId, version, payload);
  }
}
