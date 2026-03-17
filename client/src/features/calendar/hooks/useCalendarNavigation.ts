import { useState, useCallback } from 'react';
import {
  getSundayOfWeek,
  getCalendarGrid,
  getWeekGrid,
  formatWeekRange,
  MONTHS,
} from '@/shared/utils/calendar';
import type { CalendarCell } from '@/shared/utils/calendar';

export function useCalendarNavigation() {
  const now = new Date();
  const [current, setCurrent] = useState(() => ({
    year: now.getFullYear(),
    month: now.getMonth(),
  }));
  const [view, setView] = useState<'week' | 'month'>('month');
  const [weekStart, setWeekStart] = useState(() =>
    getSundayOfWeek(new Date(now.getFullYear(), now.getMonth(), 1))
  );

  const goPrev = useCallback(() => {
    if (view === 'month') {
      setCurrent((c) =>
        c.month === 0 ? { year: c.year - 1, month: 11 } : { year: c.year, month: c.month - 1 }
      );
    } else {
      setWeekStart((d) => {
        const next = new Date(d);
        next.setDate(next.getDate() - 7);
        return next;
      });
    }
  }, [view]);

  const goNext = useCallback(() => {
    if (view === 'month') {
      setCurrent((c) =>
        c.month === 11 ? { year: c.year + 1, month: 0 } : { year: c.year, month: c.month + 1 }
      );
    } else {
      setWeekStart((d) => {
        const next = new Date(d);
        next.setDate(next.getDate() + 7);
        return next;
      });
    }
  }, [view]);

  const goToday = useCallback(() => {
    const today = new Date();
    setCurrent({ year: today.getFullYear(), month: today.getMonth() });
    setWeekStart(getSundayOfWeek(today));
  }, []);

  const handleViewChange = useCallback((v: 'week' | 'month') => {
    if (v === 'week') {
      const today = new Date();
      const isViewingCurrentMonth =
        current.year === today.getFullYear() && current.month === today.getMonth();
      setWeekStart(
        isViewingCurrentMonth
          ? getSundayOfWeek(today)
          : getSundayOfWeek(new Date(current.year, current.month, 1))
      );
    }
    setView(v);
  }, [current.year, current.month]);

  const cells: CalendarCell[] =
    view === 'month' ? getCalendarGrid(current.year, current.month) : getWeekGrid(weekStart);

  const title =
    view === 'month'
      ? `${MONTHS[current.month]} ${current.year}`
      : formatWeekRange(weekStart);

  return {
    view,
    cells,
    title,
    goPrev,
    goNext,
    goToday,
    handleViewChange,
  };
}
