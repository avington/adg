import { ICommand } from './command.js';

export interface ICommandBus<C extends ICommand = ICommand> {
  /**
   * Dispatch a command to the bus.
   * @param command The command to dispatch.
   */
  dispatch(command: C): Promise<void>;
}
