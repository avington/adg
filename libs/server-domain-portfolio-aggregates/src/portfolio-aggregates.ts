import { AggregateRoot } from '@adg/server-shared-kernel';
import { v4 as uuid } from 'uuid';
import {
  PortfolioCreatedEvent,
  PortfolioUpdatedEvent,
} from '@adg/server-domain-portfolio-events';

export interface PortfolioAggregateState {
  portfolioId: string;
  userId: string;
  name: string;
  description?: string;
  isActive?: boolean;
  createdAt: Date;
  updatedAt?: Date;
  lastUpdatedBy?: string;
}

export class PortfolioAggregate extends AggregateRoot {
  private state: Partial<PortfolioAggregateState> = {};

  // Command handler: create portfolio
  public createPortfolio(data: {
    portfolioId: string;
    userId: string;
    name: string;
    description?: string;
    isActive?: boolean;
    createdAt?: Date;
    lastUpdatedBy?: string;
  }) {
    if (this.state.portfolioId) {
      throw new Error('Portfolio already exists');
    }
    const event = new PortfolioCreatedEvent(
      uuid(),
      data.portfolioId,
      this.version + 1,
      {
        portfolioId: data.portfolioId,
        userId: data.userId,
        name: data.name,
        description: data.description,
        isActive: data.isActive ?? true,
        createdAt: data.createdAt ?? new Date(),
        lastUpdatedBy: data.lastUpdatedBy ?? data.userId,
      }
    );
    this.apply(event);
  }

  // Command handler: update portfolio
  public updatePortfolio(data: {
    portfolioId: string;
    userId: string;
    name?: string;
    description?: string;
    isActive?: boolean;
    updatedAt?: Date;
    lastUpdatedBy?: string;
  }) {
    if (!this.state.portfolioId) {
      throw new Error('Portfolio does not exist');
    }
    const event = new PortfolioUpdatedEvent(
      uuid(),
      data.portfolioId,
      this.version + 1,
      {
        portfolioId: data.portfolioId,
        userId: data.userId,
        name: data.name ?? this.state.name,
        description: data.description ?? this.state.description,
        isActive: data.isActive ?? this.state.isActive,
        updatedAt: data.updatedAt ?? new Date(),
        lastUpdatedBy: data.lastUpdatedBy ?? data.userId,
      }
    );
    this.apply(event);
  }

  // Event applier: PortfolioCreatedEvent
  protected onPortfolioCreatedEvent(event: PortfolioCreatedEvent) {
    this.state = {
      portfolioId: event.payload.portfolioId,
      userId: event.payload.userId,
      name: event.payload.name,
      description: event.payload.description,
      isActive: event.payload.isActive,
      createdAt: event.payload.createdAt,
      updatedAt: event.payload.createdAt,
      lastUpdatedBy: event.payload.lastUpdatedBy,
    };
  }

  // Event applier: PortfolioUpdatedEvent
  protected onPortfolioUpdatedEvent(event: PortfolioUpdatedEvent) {
    this.state.name = event.payload.name ?? this.state.name;
    this.state.description =
      event.payload.description ?? this.state.description;
    this.state.isActive = event.payload.isActive ?? this.state.isActive;
    this.state.updatedAt = event.payload.updatedAt;
    this.state.lastUpdatedBy =
      event.payload.lastUpdatedBy ?? this.state.lastUpdatedBy;
  }

  // Optionally expose state for reading
  public getState(): Partial<PortfolioAggregateState> {
    return { ...this.state };
  }
}
