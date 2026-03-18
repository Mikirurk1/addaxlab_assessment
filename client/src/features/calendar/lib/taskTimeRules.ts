import type { TaskItem } from '@/features/calendar/types';
import { toDateKey } from '@/shared/utils/calendar';
import { nowMinutes, parseTimeToMinutes } from '@/shared/utils/time';

export function isTaskInPast(task: TaskItem, now: Date = new Date()): boolean {
  const todayKey = toDateKey(now);
  if (task.date < todayKey) return true;
  if (task.date > todayKey) return false;

  const curMin = nowMinutes(now);
  const endMin = parseTimeToMinutes(task.endTime);
  if (endMin != null) return endMin < curMin;

  const startMin = parseTimeToMinutes(task.startTime);
  if (startMin != null) return startMin < curMin;

  return false;
}

