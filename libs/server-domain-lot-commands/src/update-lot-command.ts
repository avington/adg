import { LotModel } from '@adg/global-validations';
import { Command } from '@adg/server-shared-kernel';

export class UpdateLotCommand extends Command<LotModel> {
  constructor(
    id: string,
    aggregateId: string,
    payload: LotModel,
    timestamp: Date = new Date()
  ) {
    super(id, 'UpdateLotCommand', timestamp, aggregateId, payload);
  }
}
