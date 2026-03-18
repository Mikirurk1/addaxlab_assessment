import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import type { Role } from '@/features/auth/lib/roles';
import { getNickname as getNicknameApi } from '@/shared/api/authApi';

export interface AuthFormState {
  email: string;
  name: string;
  password: string;
  confirmPassword: string;
}

interface AuthState {
  authModalOpen: boolean;
  adminModalOpen: boolean;
  user: {
    name: string;
    email: string;
    role: Role;
    nickname?: string;
  } | null;
  /** JWT auth token returned on login */
  token: string | null;
  /** Flux: auth modal form fields */
  authForm: AuthFormState;
  /** Flux: nickname input draft in avatar dropdown */
  nicknameDraft: string;
  /** Flux: nickname form error (e.g. taken) */
  nicknameError: string | null;
  /** Cache: actual nicknames by email (for Created by etc.) */
  nicknamesByEmail: Record<string, string>;
  /** Avatar image URLs by user email. */
  avatars: Record<string, string>;
  /** Set when any instance successfully loaded avatar image (so header/modal stay in sync). */
  avatarLoadedSuccess: Record<string, boolean>;
}

const initialAuthForm: AuthFormState = {
  email: '',
  name: '',
  password: '',
  confirmPassword: '',
};

const initialState: AuthState = {
  authModalOpen: false,
  adminModalOpen: false,
  user: null,
  token: null,
  authForm: initialAuthForm,
  nicknameDraft: '',
  nicknameError: null,
  nicknamesByEmail: {},
  avatars: {},
  avatarLoadedSuccess: {},
};

export const fetchNicknameByEmail = createAsyncThunk(
  'auth/fetchNicknameByEmail',
  async (email: string) => {
    const { nickname } = await getNicknameApi(email);
    return { email: email.trim().toLowerCase(), nickname: nickname ?? '' };
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuthModalOpen: (state, action: { payload: boolean }) => {
      state.authModalOpen = action.payload;
    },
    setAdminModalOpen: (state, action: { payload: boolean }) => {
      state.adminModalOpen = action.payload;
    },
    setUser: (
      state,
      action: { payload: { name: string; email: string; role: Role; nickname?: string; token?: string } | null }
    ) => {
      state.user = action.payload;
      state.token = action.payload?.token ?? state.token;
      if (action.payload?.email) {
        const key = action.payload.email.trim().toLowerCase();
        const nick = action.payload.nickname?.trim();
        if (nick) state.nicknamesByEmail[key] = nick;
      }
    },
    setNickname: (state, action: { payload: string }) => {
      if (state.user) state.user.nickname = action.payload;
      state.nicknameDraft = '';
      state.nicknameError = null;
      if (state.user?.email) {
        state.nicknamesByEmail[state.user.email.trim().toLowerCase()] = action.payload;
      }
    },
    setNicknameDraft: (state, action: { payload: string }) => {
      state.nicknameDraft = action.payload;
      state.nicknameError = null;
    },
    resetNicknameDraft: (state) => {
      state.nicknameDraft = state.user?.nickname ?? '';
      state.nicknameError = null;
    },
    setNicknameError: (state, action: { payload: string | null }) => {
      state.nicknameError = action.payload;
    },
    setAuthFormField: (
      state,
      action: { payload: { key: keyof AuthFormState; value: string } }
    ) => {
      const { key, value } = action.payload;
      state.authForm[key] = value;
    },
    setAuthForm: (state, action: { payload: Partial<AuthFormState> }) => {
      Object.assign(state.authForm, action.payload);
    },
    resetAuthForm: (state) => {
      state.authForm = { ...initialAuthForm };
    },
    clearUser: (state) => {
      state.user = null;
      state.token = null;
      state.nicknameDraft = '';
      state.nicknameError = null;
    },
    setAvatar: (
      state,
      action: { payload: { email: string; dataUrl: string } }
    ) => {
      const { email, dataUrl } = action.payload;
      const key = email.trim().toLowerCase();
      if (!key) return;
      state.avatars[key] = dataUrl;
    },
    clearAvatar: (state, action: { payload: string }) => {
      const key = action.payload.trim().toLowerCase();
      if (key) {
        delete state.avatars[key];
        delete state.avatarLoadedSuccess[key];
      }
    },
    setAvatarLoadedSuccess: (state, action: { payload: string }) => {
      const key = action.payload.trim().toLowerCase();
      if (key) state.avatarLoadedSuccess[key] = true;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchNicknameByEmail.fulfilled, (state, action) => {
      const { email, nickname } = action.payload;
      if (email) state.nicknamesByEmail[email] = nickname;
    });
  },
});

export const {
  setAuthModalOpen,
  setAdminModalOpen,
  setUser,
  setNickname,
  setNicknameDraft,
  resetNicknameDraft,
  setNicknameError,
  setAuthFormField,
  setAuthForm,
  resetAuthForm,
  clearUser,
  setAvatar,
  clearAvatar,
  setAvatarLoadedSuccess,
} = authSlice.actions;
export default authSlice.reducer;

