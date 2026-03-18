import { AdminEmail } from '../models/auth/AdminEmail.js';
import { SuperAdmin } from '../models/auth/SuperAdmin.js';
import { Nickname } from '../models/auth/Nickname.js';
import { isSuperAdmin } from './superAdminService.js';
import { Task } from '../models/Task.js';
import { deleteAvatar } from './avatarService.js';

export type Role = 'user' | 'admin' | 'super-admin';

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

export function resolveRole(email: string): Role {
  // sync resolver can't hit DB; most routes use async getRole anyway.
  return 'user';
}

export async function getRole(email: string): Promise<Role> {
  const e = normalizeEmail(email);
  if (!e) return 'user';
  if (await isSuperAdmin(e)) return 'super-admin';
  const isAdmin = await AdminEmail.exists({ email: e });
  return isAdmin ? 'admin' : 'user';
}

export async function updateAdmin(
  callerEmail: string,
  targetEmail: string,
  action: 'add' | 'remove'
): Promise<{ ok: boolean; error?: string }> {
  const caller = normalizeEmail(callerEmail);
  if (!caller || !(await isSuperAdmin(caller))) {
    return { ok: false, error: 'Only super-admin can manage admins' };
  }
  const target = normalizeEmail(targetEmail);
  if (!target) return { ok: false, error: 'Invalid email' };
  if (await isSuperAdmin(target)) return { ok: false, error: 'Cannot change super-admin' };

  if (action === 'add') {
    await AdminEmail.updateOne(
      { email: target },
      { $set: { email: target } },
      { upsert: true }
    );
  } else {
    await AdminEmail.deleteOne({ email: target });
  }
  return { ok: true };
}

export async function deleteUserAndTasks(
  callerEmail: string,
  targetEmail: string
): Promise<{ ok: boolean; error?: string }> {
  const caller = normalizeEmail(callerEmail);
  const target = normalizeEmail(targetEmail);
  if (!caller || !target) return { ok: false, error: 'Invalid email' };

  const callerRole = await getRole(caller);
  if (callerRole !== 'admin' && callerRole !== 'super-admin') {
    return { ok: false, error: 'Forbidden' };
  }

  const targetRole = await getRole(target);
  // Admins can't delete super-admin accounts.
  if (targetRole === 'super-admin' && callerRole !== 'super-admin') {
    return { ok: false, error: 'Cannot delete super-admin' };
  }

  // Delete account-related records and all user tasks/events.
  await Promise.all([
    AdminEmail.deleteOne({ email: target }),
    SuperAdmin.deleteOne({ email: target }),
    Nickname.deleteOne({ email: target }),
    Task.deleteMany({ 'createdBy.email': target }),
  ]);

  // Best-effort avatar deletion (if user has avatar).
  await deleteAvatar(target);

  return { ok: true };
}

function escapeRegExp(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export type AdminUserInfo = {
  email: string;
  nickname: string;
  role: Role;
};

export async function searchUsersForAdmin(params: {
  callerRole: Role;
  emailQuery?: string;
  adminsOnly?: boolean;
  limit?: number;
}): Promise<{ ok: true; users: AdminUserInfo[] } | { ok: false; error: string }> {
  const { callerRole } = params;
  if (callerRole !== 'admin' && callerRole !== 'super-admin') {
    return { ok: false, error: 'Forbidden' };
  }

  const adminsOnly = Boolean(params.adminsOnly);
  const limitRaw = params.limit ?? 20;
  const limit = Math.max(1, Math.min(100, Math.floor(Number(limitRaw) || 20)));

  const q = String(params.emailQuery ?? '').trim();
  const emailsFromQuery = q.includes(',')
    ? q
        .split(',')
        .map((s) => normalizeEmail(s))
        .filter(Boolean)
    : null;

  if (emailsFromQuery && emailsFromQuery.length > 0) {
    // Exact emails list.
    const [nicknames, adminEmails, superAdmins] = await Promise.all([
      Nickname.find({ email: { $in: emailsFromQuery } }).lean(),
      AdminEmail.find({ email: { $in: emailsFromQuery } }).lean(),
      SuperAdmin.find({ email: { $in: emailsFromQuery } }).lean(),
    ]);

    const nicknameByEmail = new Map<string, { nickname?: string }>();
    for (const n of nicknames as Array<{ email: string; nickname?: string }>) {
      nicknameByEmail.set(normalizeEmail(n.email), { nickname: n.nickname });
    }

    const adminSet = new Set((adminEmails as Array<{ email: string }>).map((x) => normalizeEmail(x.email)));
    const superAdminSet = new Set(
      (superAdmins as Array<{ email: string }>).map((x) => normalizeEmail(x.email))
    );

    const out: AdminUserInfo[] = [];
    for (const email of emailsFromQuery) {
      const role: Role = superAdminSet.has(email)
        ? 'super-admin'
        : adminSet.has(email)
          ? 'admin'
          : 'user';
      if (adminsOnly && role === 'user') continue;
      out.push({
        email,
        nickname: nicknameByEmail.get(email)?.nickname || email.split('@')[0] || email,
        role,
      });
    }
    return { ok: true, users: out };
  }

  // Substring search (by Nickname.email).
  const regex =
    q.length > 0 ? new RegExp(escapeRegExp(q), 'i') : /.+/i; // if empty: return early slice

  // For substring search, don't rely only on Nickname documents:
  // super-admins may not have an entry in Nickname collection.
  // Fetch candidates from all role collections and then resolve role.
  const fetchCount = Math.min(200, Math.max(limit * 3, 20));

  const [nicknames, adminEmails, superAdmins] = await Promise.all([
    Nickname.find({ email: { $regex: regex } })
      .sort({ email: 1 })
      .limit(fetchCount)
      .lean(),
    AdminEmail.find({ email: { $regex: regex } })
      .sort({ email: 1 })
      .limit(fetchCount)
      .lean(),
    SuperAdmin.find({ email: { $regex: regex } })
      .sort({ email: 1 })
      .limit(fetchCount)
      .lean(),
  ]);

  const nicknameByEmail = new Map<string, string>();
  for (const n of nicknames as Array<{ email: string; nickname?: string }>) {
    const e = normalizeEmail(n.email);
    if (!e) continue;
    if (typeof n.nickname === 'string' && n.nickname.trim()) nicknameByEmail.set(e, n.nickname.trim());
  }

  const superAdminByEmail = new Map<string, { name?: string }>();
  for (const s of superAdmins as Array<{ email: string; name?: string }>) {
    const e = normalizeEmail(s.email);
    if (!e) continue;
    superAdminByEmail.set(e, { name: s.name });
  }

  const adminSet = new Set((adminEmails as Array<{ email: string }>).map((x) => normalizeEmail(x.email)));
  const superAdminSet = new Set(superAdminByEmail.keys());

  const candidateEmails = new Set<string>();
  for (const e of nicknameByEmail.keys()) candidateEmails.add(e);
  for (const e of adminSet) candidateEmails.add(e);
  for (const e of superAdminSet) candidateEmails.add(e);

  const sorted = Array.from(candidateEmails).sort((a, b) => a.localeCompare(b));
  const out: AdminUserInfo[] = [];

  for (const email of sorted) {
    const role: Role = superAdminSet.has(email)
      ? 'super-admin'
      : adminSet.has(email)
        ? 'admin'
        : 'user';

    if (adminsOnly && role === 'user') continue;

    const nickname =
      nicknameByEmail.get(email) ||
      superAdminByEmail.get(email)?.name ||
      email.split('@')[0] ||
      email;

    out.push({ email, nickname, role });
    if (out.length >= limit) break;
  }

  return { ok: true, users: out };
}
