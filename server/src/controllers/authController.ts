import type { Request, Response } from 'express';
import { deleteUserAndTasks, getRole, searchUsersForAdmin, updateAdmin } from '../services/authService.js';
import { saveAvatar, getAvatarData, deleteAvatar } from '../services/avatarService.js';
import { ensureNickname, setNickname } from '../services/nicknameService.js';
import { SUPER_ADMIN_BOOTSTRAP_TOKEN } from '../config/index.js';
import { upsertSuperAdmin, verifySuperAdminLogin } from '../services/superAdminService.js';
import { signAuthToken } from '../services/tokenService.js';
import {
  requestPasswordReset,
  resetSuperAdminPasswordWithToken,
} from '../services/passwordResetService.js';
import { broadcast } from '../websockets/broadcast.js';

export async function getMe(req: Request, res: Response): Promise<void> {
  const email = typeof req.query.email === 'string' ? req.query.email.trim() : '';
  if (!email) {
    res.status(400).json({ error: 'email is required' });
    return;
  }
  const name = typeof req.query.name === 'string' ? req.query.name.trim() : '';
  const displayName = name || email.split('@')[0] || email;
  try {
    const role = await getRole(email);
    const nickname = (await ensureNickname(email)) ?? undefined;
    res.json({ name: displayName, email: email.toLowerCase(), role, nickname });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to resolve role' });
  }
}

export async function postLogin(req: Request, res: Response): Promise<void> {
  const body = req.body as { email?: string; name?: string; password?: string };
  const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';
  const name = typeof body.name === 'string' ? body.name.trim() : '';
  const password = typeof body.password === 'string' ? body.password : '';
  if (!email) {
    res.status(400).json({ error: 'email is required' });
    return;
  }

  const role = await getRole(email);

  // If this email is a super-admin, require password verification.
  let verifiedName: string | null = null;
  if (role === 'super-admin') {
    const verify = await verifySuperAdminLogin({ email, password });
    if (!verify.ok) {
      res.status(401).json({ error: verify.error ?? 'Invalid credentials' });
      return;
    }
    verifiedName = verify.user?.name ?? null;
  }

  const displayName =
    verifiedName || name || email.split('@')[0] || email;
  const nickname = (await ensureNickname(email)) ?? undefined;
  const token = signAuthToken({ email, name: displayName });
  res.json({ name: displayName, email, role, nickname, token });
}

export async function postSuperAdminBootstrap(req: Request, res: Response): Promise<void> {
  const token = typeof req.headers['x-bootstrap-token'] === 'string'
    ? req.headers['x-bootstrap-token'].trim()
    : '';
  if (!SUPER_ADMIN_BOOTSTRAP_TOKEN || token !== SUPER_ADMIN_BOOTSTRAP_TOKEN) {
    res.status(403).json({ error: 'Forbidden' });
    return;
  }
  const body = req.body as { email?: string; name?: string; password?: string };
  const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';
  const name = typeof body.name === 'string' ? body.name.trim() : '';
  const password = typeof body.password === 'string' ? body.password : '';
  const result = await upsertSuperAdmin({ email, name, password });
  if (!result.ok) {
    res.status(400).json({ error: result.error ?? 'Failed to save super-admin' });
    return;
  }
  res.json({ ok: true });
}

export async function getNicknameController(req: Request, res: Response): Promise<void> {
  const email = typeof req.query.email === 'string' ? req.query.email.trim() : '';
  if (!email) {
    res.status(400).json({ error: 'email is required' });
    return;
  }
  try {
    const nickname = await ensureNickname(email);
    res.json({ nickname });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to resolve nickname' });
  }
}

export async function patchMe(req: Request, res: Response): Promise<void> {
  const callerEmail = req.caller?.email ?? '';
  if (!callerEmail) {
    res.status(401).json({ error: 'Authentication required' });
    return;
  }
  const body = req.body as { nickname?: string };
  const nickname = typeof body.nickname === 'string' ? body.nickname : '';
  const result = await setNickname(callerEmail, nickname);
  if (!result.ok) {
    res.status(400).json({ error: result.error });
    return;
  }
  res.json({ nickname: nickname.trim() });
}

export async function postAdmins(req: Request, res: Response): Promise<void> {
  const callerEmail = req.caller?.email ?? '';
  if (!callerEmail) {
    res.status(401).json({ error: 'Authentication required' });
    return;
  }
  const body = req.body as { email?: string; action?: string };
  const email = typeof body.email === 'string' ? body.email.trim() : '';
  const action = body.action === 'add' || body.action === 'remove' ? body.action : undefined;
  if (!email || !action) {
    res.status(400).json({ error: 'email and action (add|remove) are required' });
    return;
  }
  const result = await updateAdmin(callerEmail, email, action);
  if (!result.ok) {
    res.status(403).json({ error: result.error ?? 'Forbidden' });
    return;
  }
  res.json({ ok: true });
}

export async function postAvatar(req: Request, res: Response): Promise<void> {
  const callerEmail = req.caller?.email ?? '';
  if (!callerEmail) {
    res.status(401).json({ error: 'Authentication required' });
    return;
  }
  const body = req.body as { dataUrl?: string };
  const dataUrl = typeof body.dataUrl === 'string' ? body.dataUrl : '';
  if (!dataUrl) {
    res.status(400).json({ error: 'dataUrl is required' });
    return;
  }
  try {
    await saveAvatar(callerEmail, dataUrl);
    const base = (req as { baseUrl?: string }).baseUrl ?? '/api/auth';
    res.status(201).json({
      url: `${base}/avatar?email=${encodeURIComponent(callerEmail)}`,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to save avatar';
    if (message === 'Image too large' || message === 'Invalid data URL') {
      res.status(400).json({ error: message });
      return;
    }
    console.error('Avatar save error:', err);
    res.status(500).json({ error: 'Failed to save avatar' });
  }
}

export async function getAvatar(req: Request, res: Response): Promise<void> {
  const email = typeof req.query.email === 'string' ? req.query.email.trim().toLowerCase() : '';
  if (!email) {
    res.status(400).json({ error: 'email is required' });
    return;
  }
  const data = await getAvatarData(email);
  if (!data) {
    // Client shows initials placeholder when the image fails to decode/load.
    // Returning 404 creates noisy console errors, so we return 200 with empty body.
    // This will still trigger `img.onerror` on the client.
    res.status(200);
    res.setHeader('Content-Type', 'image/png');
    res.setHeader('Cache-Control', 'no-store');
    res.end();
    return;
  }
  res.type(data.contentType);
  res.send(data.buffer);
}

export async function deleteAvatarController(req: Request, res: Response): Promise<void> {
  const callerEmail = req.caller?.email ?? '';
  if (!callerEmail) {
    res.status(401).json({ error: 'Authentication required' });
    return;
  }
  const deleted = await deleteAvatar(callerEmail);
  if (!deleted) {
    res.status(404).json({ error: 'Avatar not found' });
    return;
  }
  res.status(204).send();
}

export async function deleteUserController(req: Request, res: Response): Promise<void> {
  const callerEmail = req.caller?.email ?? '';
  if (!callerEmail) {
    res.status(401).json({ error: 'Authentication required' });
    return;
  }

  const targetEmail = typeof req.params.email === 'string' ? req.params.email.trim().toLowerCase() : '';
  if (!targetEmail) {
    res.status(400).json({ error: 'email is required' });
    return;
  }

  const result = await deleteUserAndTasks(callerEmail, targetEmail);
  if (!result.ok) {
    res.status(403).json({ error: result.error ?? 'Forbidden' });
    return;
  }

  // Trigger calendar refresh for connected clients.
  broadcast({ type: 'tasks_refresh' });

  res.status(204).send();
}

export async function getUsersForAdmin(req: Request, res: Response): Promise<void> {
  const callerRole = req.caller?.role;
  if (!callerRole) {
    res.status(401).json({ error: 'Authentication required' });
    return;
  }

  const emailQuery = typeof req.query.email === 'string' ? req.query.email : undefined;
  const adminsOnlyRaw = typeof req.query.adminsOnly === 'string' ? req.query.adminsOnly : undefined;
  const adminsOnly =
    adminsOnlyRaw === undefined
      ? false
      : adminsOnlyRaw === 'true' || adminsOnlyRaw === '1';

  const limitRaw = typeof req.query.limit === 'string' ? req.query.limit : undefined;
  const limit = limitRaw ? parseInt(limitRaw, 10) : undefined;

  const result = await searchUsersForAdmin({
    callerRole,
    emailQuery,
    adminsOnly,
    limit,
  });

  if (!result.ok) {
    res.status(result.error === 'Forbidden' ? 403 : 400).json({ error: result.error });
    return;
  }

  res.json({ users: result.users });
}

function resolvePasswordResetUrlBase(req: Request): string {
  const envBase = process.env.PASSWORD_RESET_URL_BASE?.trim();
  if (envBase) return envBase;

  const origin = typeof req.headers.origin === 'string' ? req.headers.origin : '';
  if (origin) {
    try {
      return new URL('/reset-password', origin).toString();
    } catch {
      // fall through to host+protocol
    }
  }

  const proto = req.protocol || 'http';
  const host = req.get('host');
  return `${proto}://${host}/reset-password`;
}

export async function postPasswordResetRequest(req: Request, res: Response): Promise<void> {
  const body = req.body as { email?: string };
  const email = typeof body.email === 'string' ? body.email.trim() : '';
  if (!email) {
    res.status(400).json({ error: 'email is required' });
    return;
  }

  const resetUrlBase = resolvePasswordResetUrlBase(req);

  // Always return 200 to avoid leaking whether account exists.
  await requestPasswordReset({ email, resetUrlBase });
  res.json({ ok: true });
}

export async function postPasswordReset(req: Request, res: Response): Promise<void> {
  const body = req.body as { token?: string; password?: string };
  const token = typeof body.token === 'string' ? body.token.trim() : '';
  const password = typeof body.password === 'string' ? body.password : '';

  if (!token || !password) {
    res.status(400).json({ error: 'token and password are required' });
    return;
  }

  const result = await resetSuperAdminPasswordWithToken({ token, password });
  if (!result.ok) {
    res.status(400).json({ error: result.error });
    return;
  }

  res.json({ ok: true });
}
