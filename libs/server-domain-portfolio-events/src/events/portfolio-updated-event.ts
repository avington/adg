import { Event } from '@adg/server-shared-kernel';

export interface PortfolioUpdatedPayload {
  portfolioId: string;
  userId: string;
  name?: string;
  isActive?: boolean;
  description?: string;
  updatedAt?: Date;
  lastUpdatedBy?: string;
}
export class PortfolioUpdatedEvent extends Event<PortfolioUpdatedPayload> {
  constructor(
    id: string,
    aggregateId: string,
    version: number,
    payload: PortfolioUpdatedPayload,
    timestamp: Date = new Date()
  ) {
    super(
      id,
      'PortfolioUpdatedEvent',
      timestamp,
      aggregateId,
      version,
      payload
    );
  }
}
