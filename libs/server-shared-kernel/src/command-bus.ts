import { ICommand } from './command';

export interface ICommandBus<C extends ICommand = ICommand> {
  /**
   * Dispatch a command to the bus.
   * @param command The command to dispatch.
   */
  dispatch(command: C): Promise<void>;
}
