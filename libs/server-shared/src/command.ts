// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface ICommand<T = any> {
  readonly commandName: string;
  readonly aggregateId?: string; // Optional for creation commands
  readonly payload: T;
}
