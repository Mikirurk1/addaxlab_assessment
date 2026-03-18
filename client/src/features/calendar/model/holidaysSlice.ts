import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { fetchWorldwideHolidaysForYear } from '@/features/calendar/api/holidays';
import type { HolidaysByDate } from '@/features/calendar/types';

export const fetchHolidays = createAsyncThunk('holidays/fetch', async () => {
  const year = new Date().getFullYear();
  const years = [year - 1, year, year + 1];
  const results = await Promise.all(years.map((y) => fetchWorldwideHolidaysForYear(y)));
  const merged: HolidaysByDate = {};
  for (const map of results) {
    for (const [date, list] of Object.entries(map)) {
      merged[date] = (merged[date] ?? []).concat(list);
    }
  }
  return merged;
});

interface HolidaysState {
  byDate: HolidaysByDate;
  loading: boolean;
}

const initialState: HolidaysState = {
  byDate: {},
  loading: false,
};

const holidaysSlice = createSlice({
  name: 'holidays',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchHolidays.pending, (state) => {
        state.loading = true;
        // Prevent stale/incorrect holiday data from being displayed after a failed refresh.
        state.byDate = {};
      })
      .addCase(fetchHolidays.fulfilled, (state, action) => {
        state.byDate = action.payload;
        state.loading = false;
      })
      .addCase(fetchHolidays.rejected, (state) => {
        state.loading = false;
      });
  },
});

export default holidaysSlice.reducer;
