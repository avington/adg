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
