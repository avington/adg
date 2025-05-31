import { Router, Request, Response } from 'express';
import { getCurrentUser } from './auth.controller';

const authRouter: Router = Router();

authRouter.get('/', getCurrentUser as (req: Request, res: Response) => unknown);

export { authRouter };
export default authRouter;
