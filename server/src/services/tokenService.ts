import jwt, { type SignOptions } from 'jsonwebtoken';
import { JWT_EXPIRES_IN, JWT_SECRET } from '../config/index.js';

export type AuthTokenPayload = {
  email: string;
  name: string;
};

export function signAuthToken(payload: AuthTokenPayload): string {
  // `jsonwebtoken` types are strict about `expiresIn` formats (e.g. "7d" not arbitrary string).
  // We accept the env value as-is.
  const options: SignOptions = { expiresIn: JWT_EXPIRES_IN as SignOptions['expiresIn'] };
  return jwt.sign(payload, JWT_SECRET, options);
}

export function verifyAuthToken(token: string): AuthTokenPayload | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as unknown;
    if (!decoded || typeof decoded !== 'object') return null;
    const email = (decoded as AuthTokenPayload).email;
    const name = (decoded as AuthTokenPayload).name;
    if (typeof email !== 'string' || typeof name !== 'string') return null;
    return { email: email.trim().toLowerCase(), name };
  } catch {
    return null;
  }
}

