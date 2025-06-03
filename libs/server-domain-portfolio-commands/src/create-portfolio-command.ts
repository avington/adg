import { Command } from '@adg/server-shared-kernel';

export interface CreatePortfolioPayload {
  portfolioId: string;
  userId: string;
  name: string;
  description?: string;
  isActive?: boolean;
  createdAt?: Date;
  lastUpdatedBy?: string;
}

export class CreatePortfolioCommand extends Command<CreatePortfolioPayload> {
  constructor(
    id: string,
    aggregateId: string,
    payload: CreatePortfolioPayload,
    timestamp: Date = new Date()
  ) {
    super(id, 'CreatePortfolioCommand', timestamp, aggregateId, payload);
  }
}
