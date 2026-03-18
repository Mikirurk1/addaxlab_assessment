import { configureStore } from '@reduxjs/toolkit';
import type { TypedUseSelectorHook } from 'react-redux';
import { useDispatch, useSelector } from 'react-redux';
import { tasksReducer, holidaysReducer, uiReducer } from '@/features/calendar/model';
import { authReducer } from '@/features/auth/model';
import { onlineUsersReducer } from '@/features/appShell/model';
import notificationsReducer from '@/features/notifications/model/notificationsSlice';
import { stringsReducer } from '@/features/i18n';
const AUTH_STORAGE_KEY = 'addax_auth_user';
const AUTH_TOKEN_KEY = 'addax_auth_token';
const AVATARS_STORAGE_KEY = 'addax_avatars';
const VALID_ROLES = ['user', 'admin', 'super-admin'] as const;

function getStoredAuthUser(): { name: string; email: string; role: 'user' | 'admin' | 'super-admin'; nickname?: string } | null {
  try {
    const raw = localStorage.getItem(AUTH_STORAGE_KEY);
    if (!raw) return null;
    const data = JSON.parse(raw) as unknown;
    if (data && typeof data === 'object' && 'name' in data && 'email' in data && typeof (data as { name: unknown }).name === 'string' && typeof (data as { email: unknown }).email === 'string') {
      const name = (data as { name: string }).name;
      const email = (data as { email: string }).email;
      const role = (data as { role?: string }).role;
      const roleOk = role && VALID_ROLES.includes(role as (typeof VALID_ROLES)[number]) ? role : 'user';
      const nicknameRaw = (data as Record<string, unknown>).nickname;
      const nickname = typeof nicknameRaw === 'string' ? nicknameRaw : undefined;
      return { name, email, role: roleOk as 'user' | 'admin' | 'super-admin', nickname };
    }
    return null;
  } catch {
    return null;
  }
}

function getStoredAvatars(): Record<string, string> {
  try {
    const raw = localStorage.getItem(AVATARS_STORAGE_KEY);
    if (!raw) return {};
    const data = JSON.parse(raw) as unknown;
    if (data && typeof data === 'object' && !Array.isArray(data)) {
      const out: Record<string, string> = {};
      for (const [k, v] of Object.entries(data as Record<string, unknown>)) {
        if (typeof v === 'string' && v.startsWith('data:')) out[k] = v;
      }
      return out;
    }
  } catch {
    // ignore
  }
  return {};
}

function getStoredAuthToken(): string | null {
  try {
    const t = localStorage.getItem(AUTH_TOKEN_KEY);
    return typeof t === 'string' && t.trim() ? t : null;
  } catch {
    return null;
  }
}

const preloadedState = {
  auth: {
    authModalOpen: false,
    adminModalOpen: false,
    user: getStoredAuthUser(),
    token: getStoredAuthToken(),
    authForm: { email: '', name: '', password: '', confirmPassword: '' },
    nicknameDraft: '',
    nicknameError: null,
    nicknamesByEmail: {},
    avatars: getStoredAvatars(),
    avatarLoadedSuccess: {},
  },
};

export const store = configureStore({
  reducer: {
    tasks: tasksReducer,
    holidays: holidaysReducer,
    ui: uiReducer,
    auth: authReducer,
    onlineUsers: onlineUsersReducer,
    notifications: notificationsReducer,
    strings: stringsReducer,
  },
  preloadedState,
});

store.subscribe(() => {
  const state = store.getState();
  const user = state.auth.user;
  const avatars = state.auth.avatars;
  const token = state.auth.token;
  try {
    if (user) {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(AUTH_STORAGE_KEY);
    }
    if (token) localStorage.setItem(AUTH_TOKEN_KEY, token);
    else localStorage.removeItem(AUTH_TOKEN_KEY);
    localStorage.setItem(AVATARS_STORAGE_KEY, JSON.stringify(avatars));
  } catch {
    // ignore
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
