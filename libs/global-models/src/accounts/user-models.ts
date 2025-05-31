export interface UserModel {
  id?: string;
  sub?: string;
  pic?: string;
  email: string;
  firstName?: string;
  lastName?: string;
  fullName?: string;
  isActive?: boolean;
  locale?: string;
  verifiedEmail?: boolean;
}

export interface CreateUserPayload {
  id?: string;
  email: string;
  firstName?: string;
  lastName?: string;
  fullName?: string;
}

export interface UpdateUserNamePayload {
  firstName?: string;
  lastName?: string;
  fullName?: string;
  updatedAt: Date;
}

export interface UserCreatedPayload {
  userId: string;
  firstName?: string;
  lastName?: string;
  fullName?: string;
  email: string;
  createdAt: Date;
}

export interface UserNameUpdatedPayload {
  firstName?: string;
  lastName?: string;
  fullName?: string;
  updatedAt: Date;
}
