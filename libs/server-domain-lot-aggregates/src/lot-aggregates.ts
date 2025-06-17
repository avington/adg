import { AggregateRoot } from '@adg/server-shared-kernel';
import { v4 as uuid } from 'uuid';
import {
  LotCreatedEvent,
  LotUpdatedEvent,
} from '@adg/server-domain-lot-events';

import { LotModel, TransactionType } from '@adg/global-validations';

export interface LotAggregateState {
  lotId?: string;
  symbol: string;
  portfolioId: string;
  userId?: string;
  transactionType: TransactionType;
  shares: number;
  price?: number;
  openDate: Date;
  createdAt?: Date;
  updatedAt?: Date;
  lastUpdatedBy?: string;
}

export class LotAggregate extends AggregateRoot {
  private state: Partial<LotAggregateState> = {};

  // Command handler: create portfolio
  public createLot(data: LotModel) {
    if (this.state.portfolioId) {
      throw new Error('Portfolio already exists');
    }
    // Explicitly pick only the expected fields from data
    const {
      lotId,
      symbol,
      portfolioId,
      userId,
      transactionType,
      shares,
      price,
      openDate,
      createdAt,
      updatedAt,
      lastUpdatedBy,
    } = data;

    const event = new LotCreatedEvent(
      uuid(),
      lotId ?? uuid(),
      this.version + 1,
      {
        lotId: uuid(),
        symbol,
        portfolioId,
        userId,
        transactionType,
        shares,
        price,
        openDate,
        createdAt: createdAt ?? new Date(),
        updatedAt: updatedAt ?? new Date(),
        lastUpdatedBy: lastUpdatedBy ?? userId,
      }
    );
    this.apply(event);
  }

  // Command handler: update portfolio
  public updateLot(data: LotModel) {
    if (!this.state.lotId) {
      throw new Error('Lot does not exist');
    }
    // Explicitly pick only the expected fields from data
    const {
      lotId,
      symbol,
      portfolioId,
      userId,
      transactionType,
      shares,
      price,
      openDate,
      lastUpdatedBy,
    } = data;

    const event = new LotUpdatedEvent(
      uuid(),
      lotId ?? this.state.lotId ?? uuid(),
      this.version + 1,
      {
        lotId: lotId ?? this.state.lotId,
        symbol: symbol ?? this.state.symbol,
        portfolioId: portfolioId ?? this.state.portfolioId,
        userId: userId ?? this.state.userId,
        transactionType: transactionType ?? this.state.transactionType,
        shares: shares ?? this.state.shares,
        price: price ?? this.state.price,
        openDate: openDate ?? this.state.openDate,
        updatedAt: new Date(), // Always update to current date
        lastUpdatedBy: lastUpdatedBy ?? this.state.lastUpdatedBy,
      }
    );
    this.apply(event);
  }

  // Event applier: LotCreatedEvent
  protected onLotCreatedEvent(event: LotCreatedEvent) {
    this.state = {
      lotId: event.payload.lotId,
      symbol: event.payload.symbol,
      portfolioId: event.payload.portfolioId,
      userId: event.payload.userId,
      transactionType: event.payload.transactionType,
      shares: event.payload.shares,
      price: event.payload.price,
      openDate: event.payload.openDate,
      createdAt: new Date(),
      updatedAt: new Date(),
      lastUpdatedBy: event.payload.lastUpdatedBy ?? event.payload.userId,
    };
  }

  // Event applier: LotUpdatedEvent
  protected onLotUpdatedEvent(event: LotUpdatedEvent) {
    this.state = {
      ...this.state,
      lotId: event.payload.lotId,
      symbol: event.payload.symbol,
      portfolioId: event.payload.portfolioId,
      userId: event.payload.userId,
      transactionType: event.payload.transactionType,
      shares: event.payload.shares,
      price: event.payload.price,
      openDate: event.payload.openDate,
      updatedAt: new Date(), // Always update to current date
      lastUpdatedBy: event.payload.lastUpdatedBy ?? event.payload.userId,
    };
  }

  // Optionally expose state for reading
  public getState(): Partial<LotAggregateState> {
    return { ...this.state };
  }
}
