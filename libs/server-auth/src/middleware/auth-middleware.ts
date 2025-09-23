import { UserModel } from '@adg/global-models';
import { NextFunction, Request, Response } from 'express';
import { OAuth2Client } from 'google-auth-library';
import { mapTokenInfoToUser } from '../auth/user-mapper';

const DEBUG_AUTH = process.env.DEBUG_AUTH === 'true';
// Default to the correct Google Client ID (matches token aud). Allow env override.
if (!process.env.GOOGLE_CLIENT_ID) {
  throw new Error(
    'GOOGLE_CLIENT_ID environment variable must be set for authentication.'
  );
}
const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
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
  // Track if the client disconnected (prevents ECONNRESET when writing)
  let aborted = false;
  const onAborted = () => {
    aborted = true;
    if (DEBUG_AUTH) console.warn('[AUTH] request aborted by client');
  };
  req.once('aborted', onAborted);

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
    // Clean up listener before exiting middleware
    req.off('aborted', onAborted);
    return next();
  }

  let token: string | undefined;
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      if (!aborted) res.status(401).json({ message: 'No token provided' });
      req.off('aborted', onAborted);
      return;
    }

    token = authHeader.split(' ')[1];

    // Verify the token with Google, but avoid hanging indefinitely.
    // If verification takes too long (e.g., network issues), fail fast with 401.
    const timeoutMs = Number(process.env.AUTH_VERIFY_TIMEOUT_MS) || 7000;
    const abortController = new AbortController();
    const timeout = setTimeout(() => {
      abortController.abort();
    }, timeoutMs);

    let ticket;
    try {
      const verifyPromise = client.verifyIdToken({
        idToken: token,
        // Accept either a single client ID or a list
        audience: CLIENT_IDS.length === 1 ? CLIENT_IDS[0] : CLIENT_IDS,
        // @ts-expect-error: google-auth-library may not support AbortSignal yet, but future versions might
        signal: abortController.signal,
      });
      ticket = await verifyPromise;
    } catch (err) {
      if (abortController.signal.aborted) {
        throw new Error('verifyIdToken timeout');
      }
      throw err;
    } finally {
      clearTimeout(timeout);
    }

    const payload = ticket.getPayload();
    if (!payload) {
      if (!aborted) res.status(401).json({ message: 'Invalid token payload' });
      req.off('aborted', onAborted);
      return;
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
    req.off('aborted', onAborted);
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
          let decodedPayload = '';
          try {
            // Use 'base64' decoding for broader compatibility
            decodedPayload = Buffer.from(parts[1], 'base64').toString('utf8');
          } catch (bufferErr) {
            console.error('Failed to base64 decode token payload:', bufferErr);
          }

          if (decodedPayload && process.env.NODE_ENV === 'development') {
            try {
              const payload = JSON.parse(decodedPayload) as Record<
                string,
                unknown
              >;
              const now = Math.floor(Date.now() / 1000);
              // Only log non-sensitive fields for debugging
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
            } catch (jsonErr) {
              console.error('Failed to parse decoded token JSON:', jsonErr);
            }
          }
        }
      }
    } catch (decodeErr) {
      console.error('Failed to decode token for diagnostics:', decodeErr);
    }
    if (!aborted) res.status(401).json({ message: 'Invalid or expired token' });
    req.off('aborted', onAborted);
    return;
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
