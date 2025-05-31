import {
  CREATE_USER_COMMAND,
  CreateUserCommand,
  UPDATE_USER_NAME_COMMAND,
  UpdateUserNameCommand,
} from '@adg/server-user';
import {
  redisConnection,
  USER_COMMANDS_QUEUE,
} from '@adg/server-bullmq-config';
import { Queue } from 'bullmq';
import express, { Request, Response, Router } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { StatusCodes } from 'http-status-codes';
import { CreateUserPayload, UpdateUserNamePayload } from '@adg/global-models';

// commands
const userCommandsQueue = new Queue<CreateUserCommand | UpdateUserNameCommand>(
  USER_COMMANDS_QUEUE,
  { connection: redisConnection }
);
const userRouter: Router = express.Router();
// --- User Routes ---
userRouter
  .route('/')
  .post(async (req: Request, res: Response) => {
    try {
      const payload: CreateUserPayload = req.body;
      if (!payload.lastName || !payload.email) {
        return res
          .status(StatusCodes.BAD_REQUEST)
          .send({ message: 'Name and email are required.' });
      }
      const id = payload.id || uuidv4(); // Allow client-provided ID or generate one
      const command: CreateUserCommand = {
        commandName: CREATE_USER_COMMAND,
        // aggregateId is not strictly needed here as it's a creation, but can be useful for idempotency key or pre-allocation
        payload: { ...payload, id },
      };
      await userCommandsQueue.add(command.commandName, command);
      return res
        .status(StatusCodes.CREATED)
        .send({ message: 'User creation command accepted.', id });
    } catch (error) {
      console.error('Error dispatching create user command:', error);
      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .send({ message: 'Internal server error.' });
    }
  })
  .put(async (req: Request, res: Response) => {
    try {
      const { userId } = req.params;
      const payload: UpdateUserNamePayload = req.body;
      if (!payload.lastName) {
        return res
          .status(StatusCodes.BAD_REQUEST)
          .send({ message: 'Name is required.' });
      }
      const command: UpdateUserNameCommand = {
        commandName: UPDATE_USER_NAME_COMMAND,
        aggregateId: userId,
        payload,
      };
      await userCommandsQueue.add(command.commandName, command);
      return res
        .status(StatusCodes.ACCEPTED)
        .send({ message: 'Update user name command accepted.' });
    } catch (error) {
      console.error('Error dispatching update user name command:', error);
      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .send({ message: 'Internal server error.' });
    }
  });

export { userRouter };
export default userRouter;
