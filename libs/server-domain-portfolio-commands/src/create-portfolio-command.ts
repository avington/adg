import { Command } from '@adg/server-shared-kernel';
import { PortfolioCreateInternalModel } from '@adg/global-validations';

export class CreatePortfolioCommand extends Command<PortfolioCreateInternalModel> {
  constructor(
    id: string,
    aggregateId: string,
    payload: PortfolioCreateInternalModel,
    timestamp: Date = new Date()
  ) {
    super(id, 'CreatePortfolioCommand', timestamp, aggregateId, payload);
  }
}
