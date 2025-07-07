import { UserModel } from '@adg/global-models';
import { NextFunction, Request, Response } from 'express';
import { OAuth2Client } from 'google-auth-library';
import { mapTokenInfoToUser } from '../auth/user-mapper';

const CLIENT_ID = process.env.GOOGLE_CLIENT_ID || 'your-google-client-id';
const client = new OAuth2Client(CLIENT_ID);
const BYPASS_AUTH = process.env.BYPASS_AUTH === 'true';

export async function googleJwtAuthMiddleware(
  req: Request & { user?: UserModel },
  res: Response,
  next: NextFunction
) {
  // Skip authentication if BYPASS_AUTH environment variable is set to 'true'
  if (BYPASS_AUTH) {
    console.log('⚠️  Authentication bypassed for development/testing');
    // Set a mock user for development
    req.user = {
      sub: 'dev-user-123',
      email: 'dev@example.com',
      fullName: 'Development User',
      firstName: 'Development',
      lastName: 'User',
      pic: '',
      locale: 'en',
      verifiedEmail: true,
    };
    return next();
  }

  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const token = authHeader.split(' ')[1];

    // Verify the token with Google
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: CLIENT_ID,
    });

    const payload = ticket.getPayload();
    if (!payload) {
      return res.status(401).json({ message: 'Invalid token payload' });
    }

    console.log(
      'Google user payload:',
      payload.family_name,
      payload.given_name,
      payload.email
    );
    // Attach user info to request
    const user = mapTokenInfoToUser(payload);

    req.user = user;
    return next();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (err) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
}

/**
 * Optional authentication middleware that can be conditionally applied
 * Returns the middleware function if authentication is required, otherwise returns a pass-through function
 */
export function optionalGoogleJwtAuthMiddleware() {
  if (BYPASS_AUTH) {
    console.log(
      '⚠️  Authentication middleware bypassed for development/testing'
    );
    return (
      req: Request & { user?: UserModel },
      res: Response,
      next: NextFunction
    ) => {
      // Set a mock user for development
      req.user = {
        sub: 'dev-user-123',
        email: 'dev@example.com',
        fullName: 'Development User',
        firstName: 'Development',
        lastName: 'User',
        pic: '',
        locale: 'en',
        verifiedEmail: true,
      };
      next();
    };
  }
  return googleJwtAuthMiddleware;
}
