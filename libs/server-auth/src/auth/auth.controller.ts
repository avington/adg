import { StatusCodes } from 'http-status-codes';
import { Request, Response } from 'express';
import { UserModel } from '@adg/global-models';

export const getCurrentUser = (
  req: Request & { user: UserModel },
  res: Response
) => {
  const user = req.user as UserModel | undefined;
  if (!user) {
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ message: 'Unauthorized' });
  }
  return res.status(StatusCodes.OK).json(user);
};
