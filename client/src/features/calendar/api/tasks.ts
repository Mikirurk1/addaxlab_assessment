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
}): Promise<TaskItem> {
  const { data } = await tasksApi.post<TaskItem>('', payload);
  return data;
}

export async function updateTask(
  id: string,
  payload: { date?: string; title?: string; order?: number; labels?: string[]; startTime?: string; endTime?: string; countryCodes?: string[] }
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
