import { Command } from '@adg/server-shared-kernel';

export interface UpdatePortfolioNamePayload {
  portfolioId: string;
  userId: string;
  name: string;
  description?: string;
  isActive?: boolean;
  updatedAt?: Date;
  lastUpdatedBy?: string;
}

export class UpdatePortfolioCommand extends Command<UpdatePortfolioNamePayload> {
  constructor(
    id: string,
    aggregateId: string,
    payload: UpdatePortfolioNamePayload,
    timestamp: Date = new Date()
  ) {
    super(id, 'UpdatePortfolioCommand', timestamp, aggregateId, payload);
  }
}
