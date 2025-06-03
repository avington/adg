import { Event } from '@adg/server-shared-kernel';

export interface PortfolioCreatedPayload {
  portfolioId: string;
  userId: string;
  name: string;
  description?: string;
  isActive?: boolean;
  createdAt: Date;
  updatedAt?: Date;
  lastUpdatedBy?: string;
}
export class PortfolioCreatedEvent extends Event<PortfolioCreatedPayload> {
  constructor(
    id: string,
    aggregateId: string,
    version: number,
    payload: PortfolioCreatedPayload,
    timestamp: Date = new Date()
  ) {
    super(
      id,
      'PortfolioCreatedEvent',
      timestamp,
      aggregateId,
      version,
      payload
    );
  }
}
