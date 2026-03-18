import { tasksApi } from '@/shared/api/axiosInstance';
import type { TaskItem } from '@/features/calendar/types';

export async function fetchTasks(date?: string): Promise<TaskItem[]> {
  const { data } = await tasksApi.get<TaskItem[]>(date ? `?date=${encodeURIComponent(date)}` : '');
  return data;
}

export async function createTask(payload: {
  date: string;
  title: string;
  order?: number;
  labels?: string[];
  startTime?: string;
  endTime?: string;
  countryCodes?: string[];
  seriesId?: string;
  recurrence?: { freq: 'none' | 'daily' | 'weekly' | 'monthly' | 'yearly'; byWeekDays?: number[] };
}): Promise<TaskItem> {
  const { data } = await tasksApi.post<TaskItem>('', payload);
  return data;
}

export async function updateTask(
  id: string,
  payload: { date?: string; title?: string; order?: number; labels?: string[]; startTime?: string; endTime?: string; countryCodes?: string[]; seriesId?: string | null; recurrence?: { freq: 'none' | 'daily' | 'weekly' | 'monthly' | 'yearly'; byWeekDays?: number[] } | null }
): Promise<TaskItem> {
  const { data } = await tasksApi.patch<TaskItem>(`/${id}`, payload);
  return data;
}

export async function deleteTask(id: string): Promise<void> {
  await tasksApi.delete(`/${id}`);
}

export async function reorderTasks(date: string, taskIds: string[]): Promise<TaskItem[]> {
  const { data } = await tasksApi.put<TaskItem[]>('/reorder', { date, taskIds });
  return data;
}

export async function createTasksBulk(payload: {
  tasks: Array<{
    date: string;
    title: string;
    order?: number;
    labels?: string[];
    startTime?: string;
    endTime?: string;
    countryCodes?: string[];
    seriesId?: string;
    recurrence?: { freq: 'none' | 'daily' | 'weekly' | 'monthly' | 'yearly'; byWeekDays?: number[] };
  }>;
}): Promise<TaskItem[]> {
  const { data } = await tasksApi.post<TaskItem[]>('/bulk', payload);
  return data;
}

export async function updateSeries(
  seriesId: string,
  payload: { title?: string; labels?: string[]; startTime?: string; endTime?: string; countryCodes?: string[] }
): Promise<{ modifiedCount: number }> {
  const { data } = await tasksApi.patch<{ modifiedCount: number }>(`/series/${encodeURIComponent(seriesId)}`, payload);
  return data;
}

export async function detachTask(id: string): Promise<TaskItem> {
  const { data } = await tasksApi.patch<TaskItem>(`/${id}/detach`, {});
  return data;
}
