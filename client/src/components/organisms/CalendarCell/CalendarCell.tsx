import { useCallback, useMemo } from 'react';
import { useAppDispatch } from '@/store';
import {
  updateTask,
  reorderTasks,
  setEventModalOpen,
  setEventModalSelectedDate,
  setEditModalTaskId,
} from '@/features/calendar/model';
import { toDateKey } from '@/shared/utils/calendar';
import { TaskCard } from '@/components/molecules/TaskCard';
import {
  Cell,
  DayRow,
  DayNumber,
  CardCount,
  HolidaysList,
  HolidayPill,
  HolidayPillMore,
  TasksList,
} from './CalendarCell.styled';
import type { TaskItem, PublicHoliday } from '@/features/calendar/types';

const CARD_LABEL_COLORS = ['#4caf50', '#f9a825', '#ff9800', '#2196f3', '#9c27b0'];

interface CalendarCellProps {
  dateKey: string;
  dayLabel: string;
  isCurrentMonth: boolean;
  tasks: TaskItem[];
  holidays: PublicHoliday[];
  searchQuery: string;
}

export function CalendarCell({
  dateKey,
  dayLabel,
  isCurrentMonth,
  tasks,
  holidays,
  searchQuery,
}: CalendarCellProps) {
  const dispatch = useAppDispatch();

  const handleDrop = useCallback(
    async (e: React.DragEvent, insertIndex: number) => {
      e.preventDefault();
      e.currentTarget.classList.remove('drag-over');
      let data: { taskId: string; date: string };
      try {
        data = JSON.parse(e.dataTransfer.getData('application/json'));
      } catch {
        return;
      }
      const { taskId, date: fromDate } = data;
      if (!taskId || !fromDate) return;
      if (fromDate === dateKey) {
        const ids = tasks.map((t) => t._id);
        const fromIdx = ids.indexOf(taskId);
        if (fromIdx === -1) return;
        ids.splice(fromIdx, 1);
        ids.splice(insertIndex, 0, taskId);
        dispatch(reorderTasks({ date: dateKey, taskIds: ids }));
      } else {
        await dispatch(updateTask({ id: taskId, payload: { date: dateKey } }));
        const newIds = [
          ...tasks.slice(0, insertIndex).map((t) => t._id),
          taskId,
          ...tasks.slice(insertIndex).map((t) => t._id),
        ];
        dispatch(reorderTasks({ date: dateKey, taskIds: newIds }));
      }
    },
    [dateKey, tasks, dispatch]
  );

  const isToday = useMemo(
    () => dateKey === toDateKey(new Date()),
    [dateKey]
  );

  const filteredTasks = searchQuery.trim()
    ? tasks.filter((t) =>
        t.title.toLowerCase().includes(searchQuery.trim().toLowerCase())
      )
    : tasks;
  const taskCount = filteredTasks.length;

  const handleCellAreaClick = useCallback(
    (e: React.MouseEvent) => {
      const el = e.target as HTMLElement;
      if (el.closest('[data-task-card]')) return;
      dispatch(setEditModalTaskId(null));
      dispatch(setEventModalSelectedDate(dateKey));
      dispatch(setEventModalOpen(true));
    },
    [dateKey, dispatch]
  );

  return (
    <Cell
      $isCurrentMonth={isCurrentMonth}
      $isToday={isToday}
      data-date-cell={dateKey}
      onClick={handleCellAreaClick}
      onDragOver={(e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
        e.currentTarget.classList.add('drag-over');
      }}
      onDragLeave={(e) => e.currentTarget.classList.remove('drag-over')}
      onDrop={(e) => handleDrop(e, tasks.length)}
    >
      <DayRow>
        <DayNumber $isCurrentMonth={isCurrentMonth} $isToday={isToday}>{dayLabel}</DayNumber>
        {taskCount > 0 && (
          <CardCount>
            {taskCount} card{taskCount !== 1 ? 's' : ''}
          </CardCount>
        )}
      </DayRow>
      {holidays.length > 0 && (
        <HolidaysList>
          {holidays.slice(0, 3).map((h) => (
            <HolidayPill key={`${h.date}-${h.countryCode}-${h.name}`} title={`${h.localName || h.name} (${h.countryCode})`}>
              {h.localName || h.name}
              <span style={{ color: '#b45309', fontSize: 9 }}>({h.countryCode})</span>
            </HolidayPill>
          ))}
          {holidays.length > 3 && (
            <HolidayPillMore>+{holidays.length - 3}</HolidayPillMore>
          )}
        </HolidaysList>
      )}
      <TasksList title="Клікніть, щоб додати подію">
        {filteredTasks.map((task) => (
          <TaskCard
            key={task._id}
            task={task}
            index={tasks.findIndex((t) => t._id === task._id)}
            labelColors={
              task.labels && task.labels.length > 0
                ? task.labels
                : [
                    CARD_LABEL_COLORS[
                      task._id
                        .split('')
                        .reduce((s, c) => s + c.charCodeAt(0), 0) % CARD_LABEL_COLORS.length
                    ],
                  ]
            }
            isHidden={
              searchQuery.trim() !== '' &&
              !task.title.toLowerCase().includes(searchQuery.trim().toLowerCase())
            }
            onDropAt={(e, idx) => handleDrop(e, idx)}
          />
        ))}
      </TasksList>
    </Cell>
  );
}
