import { createSelector } from '@reduxjs/toolkit';
import type { RootState } from '@/store';
import type { TaskItem } from '@/features/calendar/types';
import type { HolidaysByDate } from '@/features/calendar/types';

export const selectSidebarTypeFilter = (s: RootState) => s.ui.sidebarTypeFilter;
export const selectSidebarColorFilter = (s: RootState) => s.ui.sidebarColorFilter;
export const selectSidebarCountryFilter = (s: RootState) => s.ui.sidebarCountryFilter;

export const selectTasks = (s: RootState) => s.tasks.items;
export const selectHolidaysByDate = (s: RootState) => s.holidays.byDate;

export const selectTasksByDate = createSelector([selectTasks], (tasks): Record<string, TaskItem[]> => {
  const byDate: Record<string, TaskItem[]> = {};
  for (const t of tasks) {
    (byDate[t.date] ??= []).push(t);
  }
  for (const key of Object.keys(byDate)) {
    byDate[key]!.sort((a, b) => a.order - b.order);
  }
  return byDate;
});

export const selectFilteredTasksByDate = createSelector(
  [selectTasksByDate, selectSidebarTypeFilter, selectSidebarColorFilter],
  (tasksByDateAll, typeFilter, colorFilter) => {
    if (typeFilter === 'holidays') return {};
    if (colorFilter.length === 0) return tasksByDateAll;
    const out: typeof tasksByDateAll = {};
    for (const [dateKey, list] of Object.entries(tasksByDateAll)) {
      const filtered = list.filter((t) => (t.labels || []).some((l) => colorFilter.includes(l)));
      if (filtered.length) out[dateKey] = filtered;
    }
    return out;
  }
);

export const selectFilteredHolidaysByDate = createSelector(
  [selectHolidaysByDate, selectSidebarTypeFilter, selectSidebarCountryFilter],
  (holidays, typeFilter, countryFilter): HolidaysByDate => {
    if (typeFilter === 'events') return {};
    if (countryFilter.length === 0) return holidays;
    const out: HolidaysByDate = {};
    for (const [dateKey, list] of Object.entries(holidays)) {
      const filtered = list.filter((h) => countryFilter.includes(h.countryCode));
      if (filtered.length) out[dateKey] = filtered;
    }
    return out;
  }
);

