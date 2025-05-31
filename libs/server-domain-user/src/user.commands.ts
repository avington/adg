import { CreateUserPayload, UpdateUserNamePayload } from '@adg/global-models';
import { ICommand } from '@adg/server-shared';

export const CREATE_USER_COMMAND = 'CreateUserCommand';

export type CreateUserCommand = ICommand<CreateUserPayload>;

export const UPDATE_USER_NAME_COMMAND = 'UpdateUserNameCommand';

export type UpdateUserNameCommand = ICommand<UpdateUserNamePayload>;
