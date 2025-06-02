export interface UserProjection {
  _id?: string;
  id?: string;
  userId?: string;
  username?: string;
  firstName?: string;
  lastName?: string;
  email: string;
  isActive: boolean;
  lastLoginAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}
