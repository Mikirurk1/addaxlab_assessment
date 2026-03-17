import { useAppSelector } from '@/store';
import { useCalendarNavigation, useTasksByDate } from '@/features/calendar/hooks';
import { CalendarLayout } from '@/components/templates/CalendarLayout';
import { WEEKDAYS } from '@/shared/utils/calendar';

export function CalendarPage() {
  const holidays = useAppSelector((state) => state.holidays.byDate);
  const searchQuery = useAppSelector((state) => state.ui.searchQuery);
  const tasksByDate = useTasksByDate();
  const { view, cells, title, goPrev, goNext, goToday, handleViewChange } = useCalendarNavigation();

  return (
    <CalendarLayout
      weekdays={WEEKDAYS}
      cells={cells}
      tasksByDate={tasksByDate}
      holidays={holidays}
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
