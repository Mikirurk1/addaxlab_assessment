import { useMemo } from 'react';
import { useAppSelector } from '@/store';
import type { TaskItem } from '@/features/calendar/types';

export function useTasksByDate(): Record<string, TaskItem[]> {
  const tasks = useAppSelector((state) => state.tasks.items);

  return useMemo(() => {
    const byDate: Record<string, TaskItem[]> = {};
    for (const t of tasks) {
      if (!byDate[t.date]) byDate[t.date] = [];
      byDate[t.date].push(t);
    }
    for (const key of Object.keys(byDate)) {
      byDate[key].sort((a, b) => a.order - b.order);
    }
    return byDate;
  }, [tasks]);
}
