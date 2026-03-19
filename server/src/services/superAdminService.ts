import bcrypt from "bcryptjs";
import { SuperAdmin } from "../models/auth/SuperAdmin.js";
import { BCRYPT_SALT_ROUNDS } from "../config/index.js";

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

export async function isSuperAdmin(email: string): Promise<boolean> {
  const e = normalizeEmail(email);
  if (!e) return false;
  return (await SuperAdmin.exists({ email: e })) != null;
}

export async function upsertSuperAdmin(params: {
  email: string;
  name?: string;
  password: string;
}): Promise<{ ok: boolean; error?: string }> {
  const email = normalizeEmail(params.email);
  const password = params.password ?? "";
  const name = (params.name?.trim() || email.split("@")[0] || email).trim();

  if (!email) return { ok: false, error: "Invalid email" };
  if (!password || password.length < 8)
    return { ok: false, error: "Password must be at least 8 characters" };

  const passwordHash = await bcrypt.hash(password, BCRYPT_SALT_ROUNDS);
  await SuperAdmin.updateOne(
    { email },
    { $set: { name, passwordHash } },
    { upsert: true },
  );

  return { ok: true };
}

export async function verifySuperAdminLogin(params: {
  email: string;
  password: string;
}): Promise<{
  ok: boolean;
  error?: string;
  user?: { email: string; name: string };
}> {
  const email = normalizeEmail(params.email);
  const password = params.password ?? "";
  if (!email) return { ok: false, error: "Invalid email" };
  if (!password) return { ok: false, error: "Password required" };

  const record = await SuperAdmin.findOne({ email }).lean();
  if (!record) return { ok: false, error: "Invalid credentials" };

  const ok = await bcrypt.compare(password, record.passwordHash);
  if (!ok) return { ok: false, error: "Invalid credentials" };

  return { ok: true, user: { email: record.email, name: record.name } };
}
