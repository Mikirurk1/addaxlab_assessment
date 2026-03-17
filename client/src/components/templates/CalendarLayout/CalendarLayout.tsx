import { MonthNavigator } from '@/components/molecules/MonthNavigator';
import { CalendarGrid } from '@/components/organisms/CalendarGrid';
import { Layout } from './CalendarLayout.styled';
import type { TaskItem, HolidaysByDate } from '@/features/calendar/types';
import type { CalendarCell } from '@/shared/utils/calendar';

interface CalendarLayoutProps {
  weekdays: string[];
  cells: CalendarCell[];
  tasksByDate: Record<string, TaskItem[]>;
  holidays: HolidaysByDate;
  searchQuery: string;
  title: string;
  view: 'week' | 'month';
  onPrev: () => void;
  onNext: () => void;
  onToday: () => void;
  onViewChange: (v: 'week' | 'month') => void;
  gridMinHeight?: number;
}

export function CalendarLayout({
  weekdays,
  cells,
  tasksByDate,
  holidays,
  searchQuery,
  title,
  view,
  onPrev,
  onNext,
  onToday,
  onViewChange,
  gridMinHeight,
}: CalendarLayoutProps) {
  return (
    <Layout>
      <MonthNavigator
        title={title}
        view={view}
        onPrev={onPrev}
        onNext={onNext}
        onToday={onToday}
        onViewChange={onViewChange}
      />
      <CalendarGrid
        weekdays={weekdays}
        cells={cells}
        tasksByDate={tasksByDate}
        holidays={holidays}
        searchQuery={searchQuery}
        minHeight={gridMinHeight}
      />
    </Layout>
  );
}
