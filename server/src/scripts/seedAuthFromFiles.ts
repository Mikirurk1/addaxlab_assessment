import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createHash } from "node:crypto";
import mongoose from "mongoose";

import type { ITask } from "../models/Task.js";
import { Task } from "../models/Task.js";
import { AVATAR_EMAIL_HASH_ALGO, AVATAR_EMAIL_HASH_SLICE_LENGTH } from "../config/index.js";
import { AdminEmail } from "../models/auth/AdminEmail.js";
import { SuperAdmin } from "../models/auth/SuperAdmin.js";
import { Nickname } from "../models/auth/Nickname.js";
import { Avatar } from "../models/auth/Avatar.js";
import { saveAvatarBytes } from "../services/avatarService.js";

function fileUrlToPathSafe(p: string): string {
  return p;
}

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SERVER_DATA_DIR = path.join(__dirname, "..", "data");

const ADMINS_FILE = path.join(SERVER_DATA_DIR, "admins.json");
const NICKNAMES_FILE = path.join(SERVER_DATA_DIR, "nicknames.json");
const SUPER_ADMINS_FILE = path.join(SERVER_DATA_DIR, "superAdmins.json");
const AVATARS_DIR = path.join(SERVER_DATA_DIR, "avatars");

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

function getDb() {
  const db = mongoose.connection.db;
  if (!db) throw new Error('Mongo connection db is not ready');
  return db;
}

function hashEmail(email: string): string {
  return createHash(AVATAR_EMAIL_HASH_ALGO)
    .update(normalizeEmail(email))
    .digest("hex")
    .slice(0, AVATAR_EMAIL_HASH_SLICE_LENGTH);
}

async function readJsonFile<T>(filePath: string): Promise<T | null> {
  try {
    const raw = await fs.readFile(filePath, "utf8");
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

export async function seedAuthFromFilesIfEmpty(): Promise<void> {
  // fast checks
  const [adminCount, superAdminCount, nicknameCount] = await Promise.all([
    AdminEmail.countDocuments(),
    SuperAdmin.countDocuments(),
    Nickname.countDocuments(),
  ]);

  if (adminCount === 0) {
    const admins = await readJsonFile<{ admins: string[] }>(ADMINS_FILE);
    const list = admins?.admins ?? [];
    if (list.length) {
      await AdminEmail.insertMany(
        list.map((e) => ({ email: normalizeEmail(e) })),
        { ordered: false }
      );
      console.log(`[seedAuth] Seeded ${list.length} admins into Mongo`);
    }
  }

  if (nicknameCount === 0) {
    const nicknames = await readJsonFile<Record<string, string>>(NICKNAMES_FILE);
    const entries = Object.entries(nicknames ?? {}).filter(([, v]) => typeof v === "string" && v.trim());
    if (entries.length) {
      await Nickname.insertMany(
        entries.map(([email, nickname]) => {
          const n = String(nickname).trim();
          return {
            email: normalizeEmail(email),
            nickname: n,
            nicknameNormalized: n.toLowerCase(),
          };
        }),
        { ordered: false }
      );
      console.log(`[seedAuth] Seeded ${entries.length} nicknames into Mongo`);
    }
  }

  if (superAdminCount === 0) {
    const superAdmins = await readJsonFile<{ superAdmins: Array<{ email: string; name: string; passwordHash: string }> }>(
      SUPER_ADMINS_FILE
    );
    const list = superAdmins?.superAdmins ?? [];
    if (list.length) {
      await SuperAdmin.insertMany(
        list.map((u) => ({
          email: normalizeEmail(u.email),
          name: String(u.name ?? u.email.split("@")[0] ?? u.email).trim(),
          passwordHash: String(u.passwordHash),
        })),
        { ordered: false }
      );
      console.log(`[seedAuth] Seeded ${list.length} super-admins into Mongo`);
    }
  }

  // avatars: best-effort -> seed into GridFS `avatars` bucket
  const gridfsFilesCount = await getDb().collection("avatars.files").countDocuments({});

  if (gridfsFilesCount === 0) {
    // Best-effort migration from legacy `Avatar` collection (if it exists)
    try {
      const legacyDocs = await Avatar.find({}).lean();
      let migrated = 0;
      for (const doc of legacyDocs) {
        const bufRaw = doc.data as unknown as any;
        const buf = Buffer.isBuffer(bufRaw)
          ? bufRaw
          : Buffer.from(bufRaw?.buffer ?? bufRaw ?? []);
        await saveAvatarBytes(doc.email, buf, doc.contentType ?? "image/jpeg");
        migrated += 1;
      }
      if (migrated > 0) console.log(`[seedAuth] Migrated ${migrated} legacy avatars into GridFS`);
    } catch {
      // ignore legacy migration failures
    }

    let avatarsDirEntries: string[] = [];
    try {
      avatarsDirEntries = await fs.readdir(AVATARS_DIR);
    } catch {
      avatarsDirEntries = [];
    }
    const avatarFiles = new Set(avatarsDirEntries);
    if (avatarFiles.size) {
      const knownEmails = new Set<string>();
      const admins = await readJsonFile<{ admins: string[] }>(ADMINS_FILE);
      for (const e of admins?.admins ?? []) knownEmails.add(normalizeEmail(e));

      const nicknames = await readJsonFile<Record<string, string>>(NICKNAMES_FILE);
      for (const email of Object.keys(nicknames ?? {})) knownEmails.add(normalizeEmail(email));

      const superAdmins = await readJsonFile<{ superAdmins: Array<{ email: string }> }>(SUPER_ADMINS_FILE);
      for (const u of superAdmins?.superAdmins ?? []) knownEmails.add(normalizeEmail(u.email));

      // tasks might contain createdBy.email for many users
      const distinctCreatedByEmails = await Task.distinct("createdBy.email");
      for (const e of distinctCreatedByEmails) {
        if (typeof e === "string" && e.trim()) knownEmails.add(normalizeEmail(e));
      }

      // Use existing filenames directly (we only handle jpeg .jpg for now)
      for (const email of knownEmails) {
        const filename = `${hashEmail(email)}.jpg`;
        if (!avatarFiles.has(filename)) continue;
        const fullPath = path.join(AVATARS_DIR, filename);
        const data = await fs.readFile(fullPath);
        await saveAvatarBytes(email, data, "image/jpeg");
      }
    }
  }
}

