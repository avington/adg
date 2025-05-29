import { DomainTypes } from '@adg/global-models';

export interface ICommand<T = DomainTypes> {
  readonly commandName: string;
  readonly aggregateId?: string; // Optional for creation commands
  readonly payload: T;
}
