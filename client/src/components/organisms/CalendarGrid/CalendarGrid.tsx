import { CalendarHeader } from '@/components/organisms/CalendarHeader';
import { CalendarCell } from '@/components/organisms/CalendarCell';
import { Grid } from './CalendarGrid.styled';
import type { TaskItem, HolidaysByDate } from '@/features/calendar/types';
import type { CalendarCell as CalendarCellType } from '@/shared/utils/calendar';

interface CalendarGridProps {
  weekdays: string[];
  cells: CalendarCellType[];
  tasksByDate: Record<string, TaskItem[]>;
  holidays: HolidaysByDate;
  searchQuery: string;
  minHeight?: number;
}

export function CalendarGrid({
  weekdays,
  cells,
  tasksByDate,
  holidays,
  searchQuery,
  minHeight,
}: CalendarGridProps) {
  return (
    <Grid $minHeight={minHeight}>
      <CalendarHeader weekdays={weekdays} />
      {cells.map((cell) => {
        const dayTasks = tasksByDate[cell.dateKey] ?? [];
        const dayHolidays = holidays[cell.dateKey] ?? [];
        return (
          <CalendarCell
            key={cell.dateKey}
            dateKey={cell.dateKey}
            dayLabel={cell.label}
            isCurrentMonth={cell.isCurrentMonth}
            tasks={dayTasks}
            holidays={dayHolidays}
            searchQuery={searchQuery}
          />
        );
      })}
    </Grid>
  );
}
