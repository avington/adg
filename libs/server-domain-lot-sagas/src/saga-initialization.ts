import { IEventBus } from '@adg/server-shared-kernel';
import { Collection } from 'mongodb';
import { LotPositionUpdateSaga } from './lots-position-update-saga.js';
import type { LotDoc, PositionOverviewModel } from '@adg/global-models';

export class SagaInitializationService {
  private sagas: LotPositionUpdateSaga[] = [];

  constructor(
    private readonly eventBus: IEventBus,
    private readonly lotsCollection: Collection<LotDoc>,
    private readonly positionOverviewsCollection: Collection<PositionOverviewModel>
  ) {}

  public initializeSagas(): void {
    const lotPositionSaga = new LotPositionUpdateSaga(
      this.eventBus,
      this.lotsCollection,
      this.positionOverviewsCollection
    );

    this.sagas.push(lotPositionSaga);
    console.log('Sagas initialized successfully');
  }

  public getActiveSagas(): LotPositionUpdateSaga[] {
    return [...this.sagas];
  }
}
