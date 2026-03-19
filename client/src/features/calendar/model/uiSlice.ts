import { createSlice } from '@reduxjs/toolkit';

interface UiState {
  searchQuery: string;
  eventModalOpen: boolean;
  sidebarOpen: boolean;
  mobileMenuOpen: boolean;
  eventModalSelectedDate: string | null;
  /** Pre-fill time when opening create from week slot (e.g. "14:00") */
  eventModalSelectedTime: string | null;
  /** When set, modal opens in edit mode for this task */
  editModalTaskId: string | null;
  sidebarTypeFilter: 'all' | 'events' | 'holidays';
  sidebarColorFilter: string[];
  sidebarCountryFilter: string[];
  conflictModal: {
    open: boolean;
    kind: 'conflict' | 'warning';
    title: string | null;
    message: string | null;
    dateKey: string | null;
    startTime: string | null;
    endTime: string | null;
    excludeTaskId: string | null;
  };
  /** Task id currently being dragged (for ghost previews). */
  draggingTaskId: string | null;
}

const initialState: UiState = {
  searchQuery: '',
  eventModalOpen: false,
  sidebarOpen: false,
  mobileMenuOpen: false,
  eventModalSelectedDate: null,
  eventModalSelectedTime: null,
  editModalTaskId: null,
  sidebarTypeFilter: 'all',
  sidebarColorFilter: [],
  sidebarCountryFilter: [],
  conflictModal: {
    open: false,
    kind: 'conflict',
    title: null,
    message: null,
    dateKey: null,
    startTime: null,
    endTime: null,
    excludeTaskId: null,
  },
  draggingTaskId: null,
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
    setEventModalSelectedTime: (state, action: { payload: string | null }) => {
      state.eventModalSelectedTime = action.payload;
    },
    setEditModalTaskId: (state, action: { payload: string | null }) => {
      state.editModalTaskId = action.payload;
    },
    setSidebarOpen: (state, action: { payload: boolean }) => {
      state.sidebarOpen = action.payload;
    },
    setMobileMenuOpen: (state, action: { payload: boolean }) => {
      state.mobileMenuOpen = action.payload;
    },
    setSidebarTypeFilter: (state, action: { payload: 'all' | 'events' | 'holidays' }) => {
      state.sidebarTypeFilter = action.payload;
    },
    toggleSidebarColorFilter: (state, action: { payload: string }) => {
      const hex = action.payload;
      state.sidebarColorFilter = state.sidebarColorFilter.includes(hex)
        ? state.sidebarColorFilter.filter((c) => c !== hex)
        : [...state.sidebarColorFilter, hex];
    },
    resetSidebarColorFilter: (state) => {
      state.sidebarColorFilter = [];
    },
    toggleSidebarCountryFilter: (state, action: { payload: string }) => {
      const code = action.payload;
      state.sidebarCountryFilter = state.sidebarCountryFilter.includes(code)
        ? state.sidebarCountryFilter.filter((c) => c !== code)
        : [...state.sidebarCountryFilter, code];
    },
    resetSidebarCountryFilter: (state) => {
      state.sidebarCountryFilter = [];
    },
    openConflictModal: (
      state,
      action: {
        payload: {
          dateKey?: string | null;
          startTime?: string | null;
          endTime?: string | null;
          excludeTaskId?: string | null;
          kind?: 'conflict' | 'warning';
          title?: string;
          message?: string;
        };
      }
    ) => {
      state.conflictModal.open = true;
      state.conflictModal.kind = action.payload.kind ?? 'conflict';
      state.conflictModal.title = action.payload.title ?? null;
      state.conflictModal.message = action.payload.message ?? null;
      state.conflictModal.dateKey = action.payload.dateKey ?? null;
      state.conflictModal.startTime = action.payload.startTime ?? null;
      state.conflictModal.endTime = action.payload.endTime ?? null;
      state.conflictModal.excludeTaskId = action.payload.excludeTaskId ?? null;
    },
    closeConflictModal: (state) => {
      state.conflictModal.open = false;
      state.conflictModal.kind = 'conflict';
      state.conflictModal.title = null;
      state.conflictModal.message = null;
      state.conflictModal.dateKey = null;
      state.conflictModal.startTime = null;
      state.conflictModal.endTime = null;
      state.conflictModal.excludeTaskId = null;
    },
    setDraggingTaskId: (state, action: { payload: string | null }) => {
      state.draggingTaskId = action.payload;
    },
  },
});

export const {
  setSearchQuery,
  setEventModalOpen,
  setEventModalSelectedDate,
  setEventModalSelectedTime,
  setEditModalTaskId,
  setSidebarOpen,
  setMobileMenuOpen,
  setSidebarTypeFilter,
  toggleSidebarColorFilter,
  resetSidebarColorFilter,
  toggleSidebarCountryFilter,
  resetSidebarCountryFilter,
  openConflictModal,
  closeConflictModal,
  setDraggingTaskId,
} = uiSlice.actions;
export default uiSlice.reducer;
