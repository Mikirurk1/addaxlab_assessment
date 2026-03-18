import crypto from 'node:crypto';
import bcrypt from 'bcryptjs';

import { BCRYPT_SALT_ROUNDS } from '../config/index.js';
import { PasswordResetToken } from '../models/auth/PasswordResetToken.js';
import { SuperAdmin } from '../models/auth/SuperAdmin.js';
import { isSuperAdmin } from './superAdminService.js';
import { sendPasswordResetEmail } from './emailService.js';

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

function sha256Hex(input: string): string {
  return crypto.createHash('sha256').update(input).digest('hex');
}

function getTokenTtlMs(): number {
  const raw = process.env.PASSWORD_RESET_TOKEN_TTL_MS?.trim();
  const n = raw ? Number(raw) : NaN;
  return Number.isFinite(n) && n > 0 ? n : 30 * 60 * 1000; // 30 minutes
}

export async function requestPasswordReset(params: {
  email: string;
  resetUrlBase: string;
}): Promise<{ ok: true }> {
  const email = normalizeEmail(params.email);
  const resetUrlBase = params.resetUrlBase.trim();
  const ttlMs = getTokenTtlMs();

  // Don't leak account existence; API returns 200 regardless.
  const allowed = await isSuperAdmin(email);
  if (!allowed) return { ok: true };

  const token = crypto.randomBytes(32).toString('hex');
  const tokenHash = sha256Hex(token);
  const expiresAt = new Date(Date.now() + ttlMs);

  await PasswordResetToken.deleteMany({ email, usedAt: { $exists: false } });

  await PasswordResetToken.create({
    email,
    tokenHash,
    expiresAt,
  });

  const resetUrl = `${resetUrlBase}${resetUrlBase.includes('?') ? '&' : '?'}token=${encodeURIComponent(
    token
  )}`;

  // Best-effort sending: keep API response consistent even if email fails.
  await sendPasswordResetEmail({ to: email, token, resetUrl });

  return { ok: true };
}

export async function resetSuperAdminPasswordWithToken(params: {
  token: string;
  password: string;
}): Promise<{ ok: true } | { ok: false; error: string }> {
  const token = String(params.token ?? '').trim();
  const password = String(params.password ?? '');

  if (!token) return { ok: false, error: 'Token is required' };
  if (!password || password.length < 8)
    return { ok: false, error: 'Password must be at least 8 characters' };

  const tokenHash = sha256Hex(token);
  const now = new Date();

  const record = await PasswordResetToken.findOne({
    tokenHash,
    usedAt: { $exists: false },
    expiresAt: { $gt: now },
  }).lean<{ email: string } | null>();

  if (!record) return { ok: false, error: 'Invalid or expired token' };

  const passwordHash = await bcrypt.hash(password, BCRYPT_SALT_ROUNDS);

  await Promise.all([
    SuperAdmin.updateOne({ email: record.email }, { $set: { passwordHash } }),
    PasswordResetToken.updateMany(
      { tokenHash, email: record.email, usedAt: { $exists: false } },
      { $set: { usedAt: now } }
    ),
  ]);

  return { ok: true };
}

