import { Command } from '@adg/server-shared-kernel';

export interface UpdatePortfolioPayload {
  portfolioId: string;
  userId: string;
  name: string;
  description?: string;
  isActive?: boolean;
  updatedAt?: Date;
  lastUpdatedBy?: string;
}

export class UpdatePortfolioCommand extends Command<UpdatePortfolioPayload> {
  constructor(
    id: string,
    aggregateId: string,
    payload: UpdatePortfolioPayload,
    timestamp: Date = new Date()
  ) {
    super(id, 'UpdatePortfolioCommand', timestamp, aggregateId, payload);
  }
}
