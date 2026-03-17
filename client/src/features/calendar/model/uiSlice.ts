import { createSlice } from '@reduxjs/toolkit';

interface UiState {
  searchQuery: string;
  eventModalOpen: boolean;
  sidebarOpen: boolean;
  authModalOpen: boolean;
  eventModalSelectedDate: string | null;
  /** When set, modal opens in edit mode for this task */
  editModalTaskId: string | null;
}

const initialState: UiState = {
  searchQuery: '',
  eventModalOpen: false,
  sidebarOpen: false,
  authModalOpen: false,
  eventModalSelectedDate: null,
  editModalTaskId: null,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setSearchQuery: (state, action: { payload: string }) => {
      state.searchQuery = action.payload;
    },
    setEventModalOpen: (state, action: { payload: boolean }) => {
      state.eventModalOpen = action.payload;
    },
    setEventModalSelectedDate: (state, action: { payload: string | null }) => {
      state.eventModalSelectedDate = action.payload;
    },
    setEditModalTaskId: (state, action: { payload: string | null }) => {
      state.editModalTaskId = action.payload;
    },
    setSidebarOpen: (state, action: { payload: boolean }) => {
      state.sidebarOpen = action.payload;
    },
    setAuthModalOpen: (state, action: { payload: boolean }) => {
      state.authModalOpen = action.payload;
    },
  },
});

export const {
  setSearchQuery,
  setEventModalOpen,
  setEventModalSelectedDate,
  setEditModalTaskId,
  setSidebarOpen,
  setAuthModalOpen,
} = uiSlice.actions;
export default uiSlice.reducer;
