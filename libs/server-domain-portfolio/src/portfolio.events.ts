import { IDomainEvent } from '@adg/server-shared';

export const PORTFOLIO_AGGREGATE_TYPE = 'Portfolio';

export const PORTFOLIO_CREATED_EVENT = 'PortfolioCreatedEvent';
export interface PortfolioCreatedPayload {
  portfolioId: string;
  name: string;
  ownerEmail: string;
  createdAt: Date;
}
export type PortfolioCreatedEvent = IDomainEvent<PortfolioCreatedPayload>;

export const PORTFOLIO_NAME_UPDATED_EVENT = 'PortfolioNameUpdatedEvent';
export interface PortfolioNameUpdatedPayload {
  name: string;
  updatedAt: Date;
}
export type PortfolioNameUpdatedEvent =
  IDomainEvent<PortfolioNameUpdatedPayload>;
