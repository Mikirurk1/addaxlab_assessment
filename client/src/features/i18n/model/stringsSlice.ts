import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import * as stringsApi from '@/features/i18n/api/strings';

export type StringsState = {
  lang: string;
  version: number | null;
  strings: Record<string, unknown>;
  loading: boolean;
  error: string | null;
};

const initialState: StringsState = {
  lang: 'en',
  version: null,
  strings: {},
  loading: true,
  error: null,
};

export const fetchStrings = createAsyncThunk('strings/fetch', async (lang: string = 'en') => {
  return stringsApi.fetchStrings(lang);
});

const stringsSlice = createSlice({
  name: 'strings',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchStrings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStrings.fulfilled, (state, action) => {
        state.loading = false;
        state.lang = action.payload.lang;
        state.version = action.payload.version;
        state.strings = action.payload.strings ?? {};
        state.error = null;
      })
      .addCase(fetchStrings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? 'Failed to fetch strings';
      });
  },
});

export default stringsSlice.reducer;

