import type { Request, Response, NextFunction } from 'express';
import { getRole } from '../services/authService.js';
import { verifyAuthToken } from '../services/tokenService.js';

export interface Caller {
  email: string;
  name: string;
  role: 'user' | 'admin' | 'super-admin';
}

declare global {
  namespace Express {
    interface Request {
      caller?: Caller;
    }
  }
}

/** Attach req.caller from X-User-Email and X-User-Name (and resolve role). Does not require auth. */
export async function attachCaller(req: Request, _res: Response, next: NextFunction): Promise<void> {
  const auth = typeof req.headers.authorization === 'string' ? req.headers.authorization : '';
  const bearer = auth.startsWith('Bearer ') ? auth.slice('Bearer '.length).trim() : '';
  const tokenPayload = bearer ? verifyAuthToken(bearer) : null;

  const emailFromHeaders =
    typeof req.headers['x-user-email'] === 'string'
      ? req.headers['x-user-email'].trim().toLowerCase()
      : '';
  const nameFromHeaders =
    typeof req.headers['x-user-name'] === 'string'
      ? req.headers['x-user-name'].trim()
      : '';

  const email = tokenPayload?.email || emailFromHeaders;
  const name = tokenPayload?.name || nameFromHeaders;
  if (email) {
    const role = await getRole(email);
    req.caller = { email, name: name || email.split('@')[0] || email, role };
  }
  next();
}

/** Require req.caller (401 if missing). Use after attachCaller on routes that need a logged-in user. */
export function requireAuth(req: Request, res: Response, next: NextFunction): void {
  if (!req.caller) {
    res.status(401).json({ error: 'Authentication required' });
    return;
  }
  next();
}
