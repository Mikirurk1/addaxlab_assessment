export function getDaysInMonth(year: number, month: number): Date[] {
  const last = new Date(year, month + 1, 0);
  const days: Date[] = [];
  for (let d = 1; d <= last.getDate(); d++) {
    days.push(new Date(year, month, d));
  }
  return days;
}

export function getFirstDayOfMonth(year: number, month: number): number {
  return new Date(year, month, 1).getDay();
}

export function toDateKey(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

/** Parse YYYY-MM-DD to Date (local midnight). */
export function parseDateKey(key: string): Date {
  const [y, m, d] = key.split('-').map(Number);
  return new Date(y, m - 1, d);
}

/** List of date keys from start to end inclusive. */
export function getDateRangeKeys(startKey: string, endKey: string): string[] {
  const start = parseDateKey(startKey);
  const end = parseDateKey(endKey);
  const out: string[] = [];
  const cur = new Date(start);
  while (cur <= end) {
    out.push(toDateKey(cur));
    cur.setDate(cur.getDate() + 1);
  }
  return out;
}

export function formatDay(d: Date): string {
  return String(d.getDate());
}

export interface CalendarCell {
  date: Date;
  dateKey: string;
  label: string;
  isCurrentMonth: boolean;
}

/** Returns 6×7 grid of calendar cells (prev month, current, next month). */
export function getCalendarGrid(year: number, month: number, monthAbbrev: string[]): CalendarCell[] {
  const first = new Date(year, month, 1);
  const last = new Date(year, month + 1, 0);
  const firstDow = first.getDay();
  const daysInMonth = last.getDate();
  const totalCells = 6 * 7;
  const cells: CalendarCell[] = [];

  const prevMonth = month === 0 ? 11 : month - 1;
  const prevYear = month === 0 ? year - 1 : year;
  const prevLast = new Date(prevYear, prevMonth + 1, 0);
  const prevDays = prevLast.getDate();

  const nextMonth = month === 11 ? 0 : month + 1;
  const nextYear = month === 11 ? year + 1 : year;

  for (let i = 0; i < totalCells; i++) {
    if (i < firstDow) {
      const d = prevDays - firstDow + 1 + i;
      const date = new Date(prevYear, prevMonth, d);
      cells.push({
        date,
        dateKey: toDateKey(date),
        label: d === prevDays ? `${monthAbbrev[prevMonth] ?? ''} ${d}` : String(d),
        isCurrentMonth: false,
      });
    } else if (i - firstDow < daysInMonth) {
      const d = i - firstDow + 1;
      const date = new Date(year, month, d);
      cells.push({
        date,
        dateKey: toDateKey(date),
        label: String(d),
        isCurrentMonth: true,
      });
    } else {
      const d = i - firstDow - daysInMonth + 1;
      const date = new Date(nextYear, nextMonth, d);
      cells.push({
        date,
        dateKey: toDateKey(date),
        label: d === 1 ? `${monthAbbrev[nextMonth] ?? ''} ${d}` : String(d),
        isCurrentMonth: false,
      });
    }
  }
  return cells;
}

/** Sunday of the week containing date d (local time). */
export function getSundayOfWeek(d: Date): Date {
  const date = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  const day = date.getDay();
  date.setDate(date.getDate() - day);
  return date;
}

/** Returns 7 calendar cells for the week starting from Sunday (weekStart). */
export function getWeekGrid(weekStart: Date, monthAbbrev: string[]): CalendarCell[] {
  const cells: CalendarCell[] = [];
  for (let i = 0; i < 7; i++) {
    const date = new Date(weekStart.getFullYear(), weekStart.getMonth(), weekStart.getDate() + i);
    const dateKey = toDateKey(date);
    const dayNum = date.getDate();
    const label = dayNum === 1 || (i === 0 && dayNum > 7) ? `${monthAbbrev[date.getMonth()] ?? ''} ${dayNum}` : String(dayNum);
    cells.push({ date, dateKey, label, isCurrentMonth: true });
  }
  return cells;
}

/** Format week range title. */
export function formatWeekRange(weekStart: Date, monthAbbrev: string[]): string {
  const sun = weekStart;
  const sat = new Date(sun.getFullYear(), sun.getMonth(), sun.getDate() + 6);
  const sameMonth = sun.getMonth() === sat.getMonth();
  if (sameMonth) {
    return `${monthAbbrev[sun.getMonth()] ?? ''} ${sun.getDate()} – ${sat.getDate()}, ${sun.getFullYear()}`;
  }
  return `${monthAbbrev[sun.getMonth()] ?? ''} ${sun.getDate()} – ${monthAbbrev[sat.getMonth()] ?? ''} ${sat.getDate()}, ${sun.getFullYear()}`;
}
