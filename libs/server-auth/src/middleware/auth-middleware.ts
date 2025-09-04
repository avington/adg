import { UserModel } from '@adg/global-models';
import { NextFunction, Request, Response } from 'express';
import { OAuth2Client } from 'google-auth-library';
import { mapTokenInfoToUser } from '../auth/user-mapper';

const DEBUG_AUTH = process.env.DEBUG_AUTH === 'true';
// Default to the correct Google Client ID (matches token aud). Allow env override.
const CLIENT_ID =
  process.env.GOOGLE_CLIENT_ID ||
  '847015062567-q6ffv8iom5j67av7o476ukinpg3vseat.apps.googleusercontent.com';
// Allow multiple client IDs for dev/prod or localhost vs deployed (deduped)
const CLIENT_IDS = Array.from(
  new Set(
    [
      ...(process.env.GOOGLE_CLIENT_IDS
        ? process.env.GOOGLE_CLIENT_IDS.split(',').map((s) => s.trim())
        : []),
      CLIENT_ID,
    ].filter(Boolean)
  )
);
const client = new OAuth2Client(CLIENT_ID);
const BYPASS_AUTH = process.env.BYPASS_AUTH === 'true';

export async function googleJwtAuthMiddleware(
  req: Request & { user?: UserModel },
  res: Response,
  next: NextFunction
) {
  if (DEBUG_AUTH) {
    const authHeader = req.headers.authorization;
    console.log(
      `[AUTH] -> enter ${req.method} ${
        req.originalUrl || req.url
      } (authHeader=${
        authHeader ? `Bearer ${authHeader.length} chars` : 'missing'
      })`
    );
  }
  // Skip authentication if BYPASS_AUTH environment variable is set to 'true'
  if (BYPASS_AUTH) {
    if (DEBUG_AUTH) {
      console.log('⚠️  [AUTH] Bypass enabled - attaching mock user');
    }
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

  let token: string | undefined;
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'No token provided' });
    }

    token = authHeader.split(' ')[1];

    // Verify the token with Google
    const ticket = await client.verifyIdToken({
      idToken: token,
      // Accept either a single client ID or a list
      audience: CLIENT_IDS.length === 1 ? CLIENT_IDS[0] : CLIENT_IDS,
    });

    const payload = ticket.getPayload();
    if (!payload) {
      return res.status(401).json({ message: 'Invalid token payload' });
    }

    if (DEBUG_AUTH) {
      console.log(
        'Google user payload:',
        payload.family_name,
        payload.given_name,
        payload.email
      );
    }
    // Attach user info to request
    const user = mapTokenInfoToUser(payload);

    req.user = user;
    if (DEBUG_AUTH) {
      console.log('[AUTH] <- success', {
        sub: user.sub,
        email: user.email,
      });
    }
    return next();
  } catch (err) {
    // Extra diagnostics to understand why verification failed
    const msg = (err as Error)?.message || String(err);
    console.error('[AUTH] verification failed:', msg);
    if (DEBUG_AUTH) {
      console.error('[AUTH] Allowed audience(s):', CLIENT_IDS);
    }
    // Try to decode token payload (without verifying) for hints
    try {
      if (token) {
        const parts = token.split('.');
        if (parts.length === 3) {
          let payloadJson: string;
          try {
            // Use 'base64' decoding for broader compatibility
            payloadJson = Buffer.from(parts[1], 'base64').toString('utf8');
          } catch (bufferErr) {
            console.error(
              'Failed to decode token payload with base64:',
              bufferErr
            );
            payloadJson = '';
          }
          if (payloadJson) {
            const payload = JSON.parse(payloadJson) as Record<string, unknown>;
            const now = Math.floor(Date.now() / 1000);
            console.error('Token payload (decoded, unverified):', {
              aud: payload['aud'],
              azp: payload['azp'],
              iss: payload['iss'],
              iat: payload['iat'],
              nbf: payload['nbf'],
              exp: payload['exp'],
              now,
              skew: (Number(payload['iat']) || 0) - now,
            });
          }
        }
      }
    } catch (decodeErr) {
      console.error('Failed to decode token for diagnostics:', decodeErr);
    }
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
