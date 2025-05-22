import { NextFunction, Request, Response } from 'express';
import { OAuth2Client } from 'google-auth-library';

const CLIENT_ID = process.env.GOOGLE_CLIENT_ID || 'your-google-client-id';
const client = new OAuth2Client(CLIENT_ID);

export async function googleJwtAuthMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
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

    console.log('Google user payload:', payload);
    // Attach user info to request
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (req as any).googleUser = payload;
    return next();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (err) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
}
