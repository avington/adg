import { Request } from 'express';
import { UserModel } from './user-models.js';

// Extend Request to include user
export interface AuthenticatedRequest extends Request {
  user?: UserModel;
}
