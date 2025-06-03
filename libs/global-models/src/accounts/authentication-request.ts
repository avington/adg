import { Request } from 'express';
import { UserModel } from './user-models';

// Extend Request to include user
export interface AuthenticatedRequest extends Request {
  user?: UserModel;
}
