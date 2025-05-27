import { UserModel } from '@adg/global-models';
import { TokenPayload } from 'google-auth-library';

export const mapTokenInfoToUser = (tokenInfo: TokenPayload): UserModel => {
  const user: UserModel = {
    sub: tokenInfo.sub || '',
    email: tokenInfo.email || '',
    fullName: tokenInfo.name || '',
    firstName: tokenInfo.given_name || '',
    lastName: tokenInfo.family_name || '',
    pic: tokenInfo.picture || '',
    locale: tokenInfo.locale || '',
    verifiedEmail: tokenInfo.email_verified || false,
  };

  // Additional properties can be added as needed
  return user;
};
