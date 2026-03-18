import type { TaskItem } from '@/features/calendar/types';
import { intervalsOverlap, parseTimeToMinutesOrDefault } from '@/shared/utils/time';

const MIN_DURATION_MIN = 15;
const DEFAULT_START_MIN = 9 * 60;

function normalizeRange(startTime: string, endTime: string) {
  const startMin = parseTimeToMinutesOrDefault(startTime, DEFAULT_START_MIN);
  const endMinRaw = parseTimeToMinutesOrDefault(endTime, startMin + 60);
  const endMin = Math.max(startMin + MIN_DURATION_MIN, endMinRaw);
  return { startMin, endMin };
}

function taskToRange(task: TaskItem) {
  const startMin = parseTimeToMinutesOrDefault(task.startTime, DEFAULT_START_MIN);
  const endMinRaw = task.endTime
    ? parseTimeToMinutesOrDefault(task.endTime, startMin + 60)
    : startMin + 60;
  const endMin = Math.max(startMin + MIN_DURATION_MIN, endMinRaw);
  return { startMin, endMin };
}

export function getConflictingTasks(params: {
  tasks: TaskItem[];
  dateKey: string;
  startTime: string;
  endTime: string;
  excludeTaskId?: string | null;
}): TaskItem[] {
  const { tasks, dateKey, startTime, endTime, excludeTaskId } = params;
  const { startMin, endMin } = normalizeRange(startTime, endTime);
  return tasks.filter((t) => {
    if (t.date !== dateKey) return false;
    if (excludeTaskId && t._id === excludeTaskId) return false;
    const r = taskToRange(t);
    return intervalsOverlap(startMin, endMin, r.startMin, r.endMin);
  });
}

export function hasTimeConflict(params: {
  tasks: TaskItem[];
  dateKey: string;
  startTime: string;
  endTime: string;
  excludeTaskId?: string | null;
}): boolean {
  return getConflictingTasks(params).length > 0;
}

