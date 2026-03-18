export const PORT = Number(process.env.PORT) || 3001;

function requireEnv(name: string): string {
  const v = process.env[name];
  if (!v || !v.trim()) throw new Error(`[config] Missing required env var: ${name}`);
  return v.trim();
}

export const MONGODB_URI = requireEnv('MONGODB_URI');

/**
 * JWT secret for auth tokens.
 * Do not commit this value; provide it via server env (e.g. server/.env).
 */
export const JWT_SECRET = requireEnv('JWT_SECRET');

/** JWT token expiry time passed to `jsonwebtoken` (e.g. "7d", "3600s"). */
export const JWT_EXPIRES_IN = requireEnv('JWT_EXPIRES_IN');

/** bcryptjs salt rounds used for password hashing. */
export const BCRYPT_SALT_ROUNDS = Number(requireEnv('BCRYPT_SALT_ROUNDS'));
if (!Number.isFinite(BCRYPT_SALT_ROUNDS) || BCRYPT_SALT_ROUNDS <= 0) {
  throw new Error('[config] BCRYPT_SALT_ROUNDS must be a positive number');
}

/**
 * Deterministic hashing for avatar filenames derived from email.
 * These are not secrets, but keep them configurable to match legacy filenames across environments.
 */
export const AVATAR_EMAIL_HASH_ALGO = requireEnv('AVATAR_EMAIL_HASH_ALGO');
export const AVATAR_EMAIL_HASH_SLICE_LENGTH = Number(requireEnv('AVATAR_EMAIL_HASH_SLICE_LENGTH'));
if (!Number.isFinite(AVATAR_EMAIL_HASH_SLICE_LENGTH) || AVATAR_EMAIL_HASH_SLICE_LENGTH <= 0) {
  throw new Error('[config] AVATAR_EMAIL_HASH_SLICE_LENGTH must be a positive number');
}

/**
 * One-time bootstrap token to create/update super-admin credentials via API.
 * If you don't use bootstrap auth, it can stay empty.
 */
export const SUPER_ADMIN_BOOTSTRAP_TOKEN = (process.env.SUPER_ADMIN_BOOTSTRAP_TOKEN ?? '').trim();
