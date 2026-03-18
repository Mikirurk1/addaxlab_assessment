import { useAppSelector } from '@/store';
import { useCalendarNavigation } from '@/features/calendar/hooks';
import { selectFilteredHolidaysByDate, selectFilteredTasksByDate } from '@/features/calendar/model/selectors';
import { CalendarLayout } from '@/components/templates/CalendarLayout';
import { useT } from '@/features/i18n';

export function CalendarPage() {
  const t = useT();
  const searchQuery = useAppSelector((state) => state.ui.searchQuery);
  const tasksByDate = useAppSelector(selectFilteredTasksByDate);
  const holidaysFiltered = useAppSelector(selectFilteredHolidaysByDate);
  const { view, cells, title, goPrev, goNext, goToday, handleViewChange } = useCalendarNavigation();

  return (
    <CalendarLayout
      weekdays={Array.from({ length: 7 }, (_, i) => t(`date.weekdaysShort.${i}`))}
      cells={cells}
      tasksByDate={tasksByDate}
      holidays={holidaysFiltered}
      searchQuery={searchQuery}
      title={title}
      view={view}
      onPrev={goPrev}
      onNext={goNext}
      onToday={goToday}
      onViewChange={handleViewChange}
      gridMinHeight={view === 'week' ? 320 : undefined}
    />
  );
}
