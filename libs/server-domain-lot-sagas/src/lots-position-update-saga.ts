import { IEventBus } from '@adg/server-shared-kernel';
import {
  LotCreatedEvent,
  LotUpdatedEvent,
} from '@adg/server-domain-lot-events';
import { calculateDollarCostAvg } from '@adg/global-formulas';
import { LotModel } from '@adg/global-validations';
import {
  PositionLotsModel,
  PositionOverviewModel,
  LotDoc,
} from '@adg/global-models';
import { Collection } from 'mongodb';

export class LotPositionUpdateSaga {
  constructor(
    private readonly eventBus: IEventBus,
    private readonly lotsCollection: Collection<LotDoc>,
    private readonly positionOverviewsCollection: Collection<PositionOverviewModel>
  ) {
    this.eventBus.subscribe(
      'LotCreatedEvent',
      this.handleLotCreatedEvent.bind(this)
    );
    this.eventBus.subscribe(
      'LotUpdatedEvent',
      this.handleLotUpdatedEvent.bind(this)
    );
  }

  private async handleLotCreatedEvent(event: LotCreatedEvent): Promise<void> {
    await this.handleLotEvent(event);
  }

  private async handleLotUpdatedEvent(event: LotUpdatedEvent): Promise<void> {
    await this.handleLotEvent(event);
  }

  private async handleLotEvent(
    event: LotCreatedEvent | LotUpdatedEvent
  ): Promise<void> {
    const { portfolioId, symbol } = event.payload;

    console.log('[LotPositionUpdateSaga] Looking up position overview', {
      portfolioId,
      symbol,
      dbEnv: process.env.READ_MODEL_DB_NAME,
    });
    const positionOverview = await this.positionOverviewsCollection.findOne({
      portfolioId,
      symbol: symbol.toUpperCase(),
    });
    if (!positionOverview) {
      console.warn('[LotPositionUpdateSaga] Not found', {
        portfolioId,
        symbol,
      });
      return;
    }

    const lots = await this.getAllLotsForSymbolAndPortfolio(
      portfolioId,
      symbol
    );

    const positionLots = calculateDollarCostAvg(
      lots,
      portfolioId,
      positionOverview.positionId
    );

    console.log(
      `[LotPositionUpdateSaga] Computed lots for ${portfolioId}:${symbol} -> totalShares=${positionLots.totalShares}, avg=${positionLots.averagePrice}, realized=${positionLots.realizedGains}`
    );

    await this.updatePositionOverviewWithLots(
      positionOverview.positionId,
      positionLots
    );
  }

  private async getAllLotsForSymbolAndPortfolio(
    portfolioId: string,
    symbol: string
  ): Promise<LotModel[]> {
    const lotDocuments = await this.lotsCollection
      .find({
        portfolioId,
        symbol: { $regex: `^${symbol}$`, $options: 'i' },
      })
      .sort({ openDate: 1 })
      .toArray();

    if (lotDocuments.length === 0) {
      console.warn(
        `[LotPositionUpdateSaga] No lots found for ${portfolioId}:${symbol} (case-insensitive)`
      );
    }

    return lotDocuments.map((doc) => ({
      lotId: doc.lotId,
      symbol: doc.symbol,
      portfolioId: doc.portfolioId,
      userId: doc.userId,
      transactionType: doc.transactionType,
      shares: doc.shares,
      price: doc.price,
      openDate: new Date(doc.openDate),
      createdAt: doc.createdAt ? new Date(doc.createdAt) : undefined,
      updatedAt: doc.updatedAt ? new Date(doc.updatedAt) : undefined,
      lastUpdatedBy: doc.lastUpdatedBy,
      costBasis: doc.costBasis,
      marketValue: doc.marketValue,
      holdingPeriod: doc.holdingPeriod,
      gainsLosses: doc.gainsLosses,
      gainsLossesPercentage: doc.gainsLossesPercentage,
    }));
  }

  private async updatePositionOverviewWithLots(
    positionId: string,
    positionLots: PositionLotsModel
  ): Promise<void> {
    await this.positionOverviewsCollection.updateOne(
      { positionId },
      {
        $set: {
          lots: {
            portfolioId: positionLots.portfolioId,
            positionId: positionLots.positionId,
            totalShares: positionLots.totalShares,
            averagePrice: positionLots.averagePrice,
            realizedGains: positionLots.realizedGains,
          },
          updatedAt: new Date(),
        },
      }
    );
  }

  // Removed unused updatePositionLots method to resolve the error.
}
