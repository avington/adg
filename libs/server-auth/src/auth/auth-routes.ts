import { Router, Request, Response } from 'express';
import { getCurrentUser } from './auth.controller';

const userRouter: Router = Router();

userRouter.get('/', getCurrentUser as (req: Request, res: Response) => unknown);

export { userRouter };
export default userRouter;
