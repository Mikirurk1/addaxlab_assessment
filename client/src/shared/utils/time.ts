export function parseTimeToMinutes(timeStr: string | undefined): number | null {
  if (!timeStr || !/^\d{1,2}:\d{2}$/.test(timeStr)) return null;
  const [h, m] = timeStr.split(':').map(Number);
  if (Number.isNaN(h) || Number.isNaN(m)) return null;
  return h * 60 + m;
}

export function parseTimeToMinutesOrDefault(
  timeStr: string | undefined,
  defaultMinutes: number
): number {
  const v = parseTimeToMinutes(timeStr);
  return v == null ? defaultMinutes : v;
}

export function minutesToTime(totalMin: number): string {
  const m = Math.max(0, Math.min(24 * 60, Math.round(totalMin)));
  const hh = Math.floor(m / 60);
  const mm = m % 60;
  return `${String(hh).padStart(2, '0')}:${String(mm).padStart(2, '0')}`;
}

export function intervalsOverlap(aStart: number, aEnd: number, bStart: number, bEnd: number): boolean {
  return aStart < bEnd && aEnd > bStart;
}

export function clamp(min: number, v: number, max: number): number {
  return Math.max(min, Math.min(v, max));
}

export function nowMinutes(now: Date = new Date()): number {
  return now.getHours() * 60 + now.getMinutes();
}

