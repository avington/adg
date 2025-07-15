import { Command } from '@adg/server-shared-kernel';
import { PositionOverviewModel } from '@adg/global-models';

export class CreatePositionCommand extends Command<PositionOverviewModel> {
  constructor(
    id: string,
    aggregateId: string,
    payload: PositionOverviewModel,
    timestamp: Date = new Date()
  ) {
    super(id, 'CreatePositionCommand', timestamp, aggregateId, payload);
  }
}
