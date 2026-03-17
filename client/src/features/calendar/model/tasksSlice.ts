import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import * as tasksApi from '@/features/calendar/api/tasks';
import type { TaskItem } from '@/features/calendar/types';

export const fetchTasks = createAsyncThunk('tasks/fetchAll', () => tasksApi.fetchTasks());

export const createTask = createAsyncThunk(
  'tasks/create',
  async (
    payload: {
      date: string;
      title: string;
      order?: number;
      labels?: string[];
      startTime?: string;
      endTime?: string;
      countryCodes?: string[];
    },
    { dispatch }
  ) => {
    await tasksApi.createTask(payload);
    const result = await dispatch(fetchTasks());
    return result.payload as TaskItem[];
  }
);

export const updateTask = createAsyncThunk(
  'tasks/update',
  async (
    {
      id,
      payload,
    }: {
      id: string;
      payload: { date?: string; title?: string; order?: number; labels?: string[]; startTime?: string; endTime?: string; countryCodes?: string[] };
    },
    { dispatch }
  ) => {
    await tasksApi.updateTask(id, payload);
    await dispatch(fetchTasks());
  }
);

export const deleteTask = createAsyncThunk(
  'tasks/delete',
  async (id: string, { dispatch }) => {
    await tasksApi.deleteTask(id);
    await dispatch(fetchTasks());
  }
);

export const reorderTasks = createAsyncThunk(
  'tasks/reorder',
  async (
    { date, taskIds }: { date: string; taskIds: string[] },
    { dispatch }
  ) => {
    await tasksApi.reorderTasks(date, taskIds);
    await dispatch(fetchTasks());
  }
);

interface TasksState {
  items: TaskItem[];
  loading: boolean;
  error: string | null;
}

const initialState: TasksState = {
  items: [],
  loading: true,
  error: null,
};

const tasksSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTasks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload ?? [];
        state.error = null;
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? 'Failed to fetch tasks';
      })
      .addCase(createTask.rejected, (state, action) => {
        state.error = action.error.message ?? 'Failed to create task';
      })
      .addCase(updateTask.rejected, (state, action) => {
        state.error = action.error.message ?? 'Failed to update task';
      })
      .addCase(deleteTask.rejected, (state, action) => {
        state.error = action.error.message ?? 'Failed to delete task';
      })
      .addCase(reorderTasks.rejected, (state, action) => {
        state.error = action.error.message ?? 'Failed to reorder tasks';
      });
  },
});

export default tasksSlice.reducer;
