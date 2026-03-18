import mongoose from 'mongoose';
import { GridFSBucket } from 'mongodb';
import { createHash } from 'node:crypto';
import { AVATAR_EMAIL_HASH_ALGO, AVATAR_EMAIL_HASH_SLICE_LENGTH } from '../config/index.js';

/** Max size of decoded image buffer we accept (500 KB). */
export const AVATAR_MAX_BODY_BYTES = 500 * 1024;

const BUCKET_NAME = 'avatars';

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

function getDb() {
  const db = mongoose.connection.db;
  if (!db) throw new Error('Mongo connection db is not ready');
  return db;
}

function parseDataUrl(dataUrl: string): { mimeType: string; base64: string } | null {
  const match = /^data:(image\/\w+);base64,(.+)$/.exec(dataUrl);
  if (!match) return null;
  return { mimeType: match[1], base64: match[2] };
}

function hashEmail(email: string): string {
  // Keep same deterministic hashing strategy as legacy filename approach.
  return createHash(AVATAR_EMAIL_HASH_ALGO)
    .update(normalizeEmail(email))
    .digest('hex')
    .slice(0, AVATAR_EMAIL_HASH_SLICE_LENGTH);
}

function getBucket(): GridFSBucket {
  return new GridFSBucket(getDb(), { bucketName: BUCKET_NAME });
}

function filenameForEmail(email: string): string {
  return hashEmail(email);
}

export async function saveAvatar(email: string, dataUrl: string): Promise<void> {
  const key = normalizeEmail(email);
  if (!key) throw new Error('Invalid email');

  const parsed = parseDataUrl(dataUrl);
  if (!parsed) {
    throw new Error('Invalid data URL');
  }

  const buf = Buffer.from(parsed.base64, 'base64');
  if (buf.length > AVATAR_MAX_BODY_BYTES) {
    throw new Error('Image too large');
  }

  await saveAvatarBytes(key, buf, parsed.mimeType);
}

export async function saveAvatarBytes(
  email: string,
  buffer: Buffer,
  contentType: string
): Promise<void> {
  const key = normalizeEmail(email);
  if (!key) throw new Error('Invalid email');
  if (buffer.length > AVATAR_MAX_BODY_BYTES) throw new Error('Image too large');

  const bucket = getBucket();
  const filesCol = getDb().collection(`${BUCKET_NAME}.files`);
  const filename = filenameForEmail(key);

  // Replace existing avatar (unique by filename)
  const existing = await filesCol.findOne({ filename });
  if (existing?._id) {
    await bucket.delete(existing._id);
  }

  await new Promise<void>((resolve, reject) => {
    const uploadStream = bucket.openUploadStream(filename, {
      metadata: { email: key, contentType },
      contentType,
    } as any);
    uploadStream.on('finish', () => resolve());
    uploadStream.on('error', reject);
    uploadStream.end(buffer);
  });
}

export async function getAvatarData(
  email: string
): Promise<{ buffer: Buffer; contentType: string } | null> {
  const key = normalizeEmail(email);
  if (!key) return null;
  const bucket = getBucket();
  const filesCol = getDb().collection(`${BUCKET_NAME}.files`);
  const filename = filenameForEmail(key);

  const fileDoc = await filesCol.findOne({ filename });
  if (!fileDoc?._id) return null;
  const contentType =
    (fileDoc as any).contentType ||
    (fileDoc as any).metadata?.contentType ||
    'image/jpeg';

  const chunks: Buffer[] = [];
  const downloadStream = bucket.openDownloadStreamByName(filename);

  await new Promise<void>((resolve, reject) => {
    downloadStream.on('data', (chunk) => chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk)));
    downloadStream.on('end', () => resolve());
    downloadStream.on('error', reject);
  });

  return { buffer: Buffer.concat(chunks), contentType };
}

export async function deleteAvatar(email: string): Promise<boolean> {
  const key = normalizeEmail(email);
  if (!key) return false;
  const bucket = getBucket();
  const filesCol = getDb().collection(`${BUCKET_NAME}.files`);
  const filename = filenameForEmail(key);
  const existing = await filesCol.findOne({ filename });
  if (!existing?._id) return false;
  await bucket.delete(existing._id);
  return true;
}
