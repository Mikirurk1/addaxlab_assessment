import { toDateKey } from '@/shared/utils/calendar';
import { nowMinutes, parseTimeToMinutesOrDefault } from '@/shared/utils/time';

const DEFAULT_START_MIN = 9 * 60;

export function isPastDay(dateKey: string, now: Date = new Date()): boolean {
  return dateKey < toDateKey(now);
}

export function isPastTimeToday(dateKey: string, startTime: string, now: Date = new Date()): boolean {
  const todayKey = toDateKey(now);
  if (dateKey !== todayKey) return false;
  const startMin = parseTimeToMinutesOrDefault(startTime, DEFAULT_START_MIN);
  return startMin < nowMinutes(now);
}

export function canCreateAt(dateKey: string, startTime: string, now: Date = new Date()): boolean {
  if (isPastDay(dateKey, now)) return false;
  if (isPastTimeToday(dateKey, startTime, now)) return false;
  return true;
}

