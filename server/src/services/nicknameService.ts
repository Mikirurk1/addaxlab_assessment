import { Nickname } from '../models/auth/Nickname.js';

const NICKNAME_MIN = 2;
const NICKNAME_MAX = 50;
const NICKNAME_REGEX = /^[a-zA-Z0-9_\u0400-\u04FF-]+$/;

const nicknamesCacheByEmail: Record<string, string> = {};
let cacheLoaded = false;

export async function initNicknameCache(): Promise<void> {
  const docs = await Nickname.find({}, { email: 1, nickname: 1 }).lean();
  for (const d of docs) {
    nicknamesCacheByEmail[String(d.email).trim().toLowerCase()] = String(d.nickname);
  }
  cacheLoaded = true;
}

export function getNickname(email: string): string | null {
  const key = email.trim().toLowerCase();
  if (!key || !cacheLoaded) return null;
  return nicknamesCacheByEmail[key] ?? null;
}

export function validateNickname(nickname: string): { ok: true } | { ok: false; error: string } {
  const s = nickname.trim();
  if (s.length < NICKNAME_MIN) return { ok: false, error: 'Nickname is too short' };
  if (s.length > NICKNAME_MAX) return { ok: false, error: 'Nickname is too long' };
  if (!NICKNAME_REGEX.test(s)) return { ok: false, error: 'Nickname can only contain letters, numbers, underscore and hyphen' };
  return { ok: true };
}

function sanitizeBase(base: string): string {
  const s = base
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9_\u0400-\u04FF-]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '');
  return s || 'user';
}

function randomSuffix(len: number = 4): string {
  return Math.random().toString(36).slice(2, 2 + len);
}

export async function ensureNickname(email: string): Promise<string | null> {
  const key = email.trim().toLowerCase();
  if (!key) return null;
  const cached = getNickname(key);
  if (cached) return cached;

  const existingDoc = await Nickname.findOne({ email: key }).lean();
  if (existingDoc) return existingDoc.nickname;

  const local = key.split('@')[0] || 'user';
  const base = sanitizeBase(local);

  // try a few times for uniqueness; extremely unlikely to exhaust
  for (let i = 0; i < 20; i++) {
    const candidate = `${base}-${randomSuffix(4)}`;
    const validation = validateNickname(candidate);
    if (!validation.ok) continue;
    const candidateNormalized = candidate.trim().toLowerCase();
    const taken = await Nickname.findOne({
      nicknameNormalized: candidateNormalized,
      email: { $ne: key },
    }).lean();
    if (taken) continue;
    const res = await setNickname(key, candidate);
    if (res.ok) return candidate;
  }

  // last resort: timestamp-based
  const fallback = `${base}-${Date.now().toString(36)}`;
  const res = await setNickname(key, fallback);
  return res.ok ? fallback : null;
}

export async function setNickname(
  email: string,
  nickname: string
): Promise<{ ok: true } | { ok: false; error: string }> {
  const key = email.trim().toLowerCase();
  if (!key) return { ok: false, error: 'Invalid email' };

  const trimmed = nickname.trim();
  if (trimmed === '') {
    await Nickname.deleteOne({ email: key });
    delete nicknamesCacheByEmail[key];
    return { ok: true };
  }

  const validation = validateNickname(nickname);
  if (!validation.ok) return validation;

  const normalized = trimmed.toLowerCase();
  const taken = await Nickname.findOne({
    nicknameNormalized: normalized,
    email: { $ne: key },
  }).lean();
  if (taken) return { ok: false, error: 'This nickname is already taken' };

  await Nickname.updateOne(
    { email: key },
    { $set: { nickname: trimmed, nicknameNormalized: normalized } },
    { upsert: true }
  );
  nicknamesCacheByEmail[key] = trimmed;
  return { ok: true };
}
