import axios from 'axios';
import { getAuthToken, setAuthToken } from './authToken';

const API_BASE = (import.meta.env.VITE_API_URL ?? '').replace(/\/$/, '');

export type Role = 'user' | 'admin' | 'super-admin';

export interface AuthMeResponse {
  name: string;
  email: string;
  role: Role;
  nickname?: string;
}

export const authApi = axios.create({
  baseURL: `${API_BASE}/api/auth`,
  headers: { 'Content-Type': 'application/json' },
});

authApi.interceptors.request.use((cfg) => {
  const token = getAuthToken();
  if (token) {
    cfg.headers = cfg.headers ?? {};
    cfg.headers.Authorization = `Bearer ${token}`;
  }
  return cfg;
});

export async function getMe(email: string, name?: string): Promise<AuthMeResponse> {
  const params = new URLSearchParams({ email: email.trim().toLowerCase() });
  if (name?.trim()) params.set('name', name.trim());
  const { data } = await authApi.get<AuthMeResponse>('/me', { params });
  return data;
}

export async function login(email: string, password: string, name?: string): Promise<AuthMeResponse & { token: string }> {
  const { data } = await authApi.post<AuthMeResponse & { token: string }>('/login', {
    email: email.trim().toLowerCase(),
    password,
    name: name?.trim() || undefined,
  });
  if (data.token) setAuthToken(data.token);
  return data;
}

/** Request a password reset email with a one-time token (best-effort, server returns 200 always). */
export async function requestPasswordReset(email: string): Promise<void> {
  await authApi.post('/password-reset/request', { email: email.trim().toLowerCase() });
}

export async function updateAdmins(
  currentUserEmail: string,
  targetEmail: string,
  action: 'add' | 'remove'
): Promise<void> {
  await authApi.post(
    '/admins',
    { email: targetEmail.trim().toLowerCase(), action },
    { headers: { 'X-User-Email': currentUserEmail.trim().toLowerCase() } }
  );
}

/** Upload avatar (compressed data URL). Returns full URL to load the image. */
export async function uploadAvatar(email: string, dataUrl: string): Promise<string> {
  const { data } = await authApi.post<{ url: string }>('/avatar', { dataUrl }, {
    headers: { 'X-User-Email': email.trim().toLowerCase() },
  });
  const url = data.url;
  return url.startsWith('http') ? url : `${API_BASE}${url.startsWith('/') ? '' : '/'}${url}`;
}

export async function deleteAvatar(email: string): Promise<void> {
  await authApi.delete('/avatar', {
    headers: { 'X-User-Email': email.trim().toLowerCase() },
  });
}

/** Delete account and all user tasks/events (admin/super-admin only). */
export async function deleteUserAndTasks(targetEmail: string): Promise<void> {
  const email = targetEmail.trim().toLowerCase();
  await authApi.delete(`/users/${encodeURIComponent(email)}`);
}

/** Set unique nickname (others see it on hover over avatar). */
export async function setNickname(email: string, nickname: string): Promise<{ nickname: string }> {
  const { data } = await authApi.patch<{ nickname: string }>('/me', { nickname }, {
    headers: { 'X-User-Email': email.trim().toLowerCase() },
  });
  return data;
}

export async function getNickname(email: string): Promise<{ nickname: string | null }> {
  const params = new URLSearchParams({ email: email.trim().toLowerCase() });
  const { data } = await authApi.get<{ nickname: string | null }>('/nickname', { params });
  return data;
}

export type AdminUserRole = 'user' | 'admin' | 'super-admin';

export interface AdminUserInfo {
  email: string;
  nickname: string;
  role: AdminUserRole;
}

export async function searchUsersForAdmin(params: {
  emailQuery?: string;
  adminsOnly?: boolean;
  limit?: number;
}): Promise<{ users: AdminUserInfo[] }> {
  const { data } = await authApi.get<{ users: AdminUserInfo[] }>('/users', {
    params: {
      email: params.emailQuery ?? '',
      adminsOnly: params.adminsOnly ? 'true' : 'false',
      limit: String(params.limit ?? 20),
    },
  });
  return data;
}

/** URL to load avatar image for the given email (may 404 if no avatar). */
export function getAvatarUrl(email: string): string {
  const q = encodeURIComponent(email.trim().toLowerCase());
  const path = `/api/auth/avatar?email=${q}`;
  return path.startsWith('http') ? path : `${API_BASE}${path.startsWith('/') ? '' : '/'}${path}`;
}
