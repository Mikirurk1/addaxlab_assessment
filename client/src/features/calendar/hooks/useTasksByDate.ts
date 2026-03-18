import { useAppSelector } from '@/store';
import type { TaskItem } from '@/features/calendar/types';
import { selectTasksByDate } from '@/features/calendar/model/selectors';

export function useTasksByDate(): Record<string, TaskItem[]> {
  return useAppSelector(selectTasksByDate);
}
