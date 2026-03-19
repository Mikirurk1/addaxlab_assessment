import { useEffect, useMemo, useRef, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/store';
import { updateTask, setEditModalTaskId, setEventModalOpen, setEventModalSelectedDate, setEventModalSelectedTime, openConflictModal } from '@/features/calendar/model';
import { setAuthModalOpen } from '@/features/auth/model';
import { pushToast } from '@/features/notifications/model/notificationsSlice';
import type { TaskItem } from '@/features/calendar/types';
import type { CalendarCell } from '@/shared/utils/calendar';
import { toDateKey } from '@/shared/utils/calendar';
import { isTaskInPast } from '@/features/calendar/lib/taskTimeRules';
import { canCreateAt, isPastDay as isPastDayRule } from '@/features/calendar/lib/rules';
import { clamp, minutesToTime, nowMinutes, parseTimeToMinutesOrDefault } from '@/shared/utils/time';
import { hasTimeConflict } from '@/features/calendar/lib/conflicts';
import { useT } from '@/features/i18n';
import { canEditTask } from '@/features/auth/lib/permissions';
import { CalendarEventItem } from '@/components/molecules/CalendarEventItem';
import { CalendarEventGhost } from '@/components/molecules/CalendarEventGhost';
import { readDragEventPayload } from '@/features/calendar/dnd/dragPayload';
import { selectDraggingEvent } from '@/features/calendar/dnd/selectDraggingEvent';
import {
  WeekViewWrap,
  WeekGrid,
  WeekCorner,
  WeekDayHeader,
  WeekDayHeaderInner,
  WeekDayDateBadge,
  WeekTimeLabel,
  WeekDayColumn,
  WeekHourSlot,
  WeekEventResizeHandle,
} from './WeekView.styled';

const HOURS = 24;
const STEP_MIN = 15;
const MIN_DURATION_MIN = 15;

function formatHourLabel(hour: number): string {
  return `${hour.toString().padStart(2, '0')}:00`;
}

function snapToStep(min: number, step = 30): number {
  return Math.round(min / step) * step;
}

const DEFAULT_LABEL_COLOR = '#9ca3af';

interface WeekViewProps {
  cells: CalendarCell[];
  tasksByDate: Record<string, TaskItem[]>;
  searchQuery: string;
}

type ResizeEdge = 'top' | 'bottom';
type ResizeState = {
  taskId: string;
  dayIndex: number;
  edge: ResizeEdge;
  startY: number;
  columnHeight: number;
  initialStartMin: number;
  initialEndMin: number;
};

export function WeekView({ cells, tasksByDate, searchQuery }: WeekViewProps) {
  const dispatch = useAppDispatch();
  const currentUser = useAppSelector((s) => s.auth.user);
  const t = useT();
  const todayKey = useMemo(() => toDateKey(new Date()), []);
  const columnRefs = useRef<Array<HTMLDivElement | null>>([]);
  const isDraggingRef = useRef(false);
  const draggingTaskId = useAppSelector((s) => s.ui.draggingTaskId);
  const draggingTask = useAppSelector(selectDraggingEvent);
  const [dragPreview, setDragPreview] = useState<{
    dayIndex: number;
    topPct: number;
    heightPct: number;
    taskForRender: TaskItem;
    labelColors: string[];
    durationMin: number;
  } | null>(null);
  const [resize, setResize] = useState<ResizeState | null>(null);
  const [timeOverrides, setTimeOverrides] = useState<
    Record<string, { startTime: string; endTime: string }>
  >({});
  const timeOverridesRef = useRef(timeOverrides);

  useEffect(() => {
    timeOverridesRef.current = timeOverrides;
  }, [timeOverrides]);

  useEffect(() => {
    if (draggingTaskId) {
      isDraggingRef.current = true;
      return;
    }
    // small delay so click doesn't fire right after drop
    window.setTimeout(() => {
      isDraggingRef.current = false;
    }, 0);
  }, [draggingTaskId]);

  const dayTasks = useMemo(() => {
    return cells.map((cell) => {
      const tasks = (tasksByDate[cell.dateKey] ?? []).filter((task) => {
        if (!searchQuery.trim()) return true;
        return (task.title ?? '').toLowerCase().includes(searchQuery.trim().toLowerCase());
      });
      return { dateKey: cell.dateKey, label: cell.label, tasks };
    });
  }, [cells, tasksByDate, searchQuery]);

  const eventsByDay = useMemo(() => {
    return dayTasks.map(({ tasks }) =>
      tasks.map((task) => {
        const startMin = parseTimeToMinutesOrDefault(task.startTime, 9 * 60);
        const endMin = task.endTime
          ? parseTimeToMinutesOrDefault(task.endTime, startMin + 60)
          : startMin + 60;
        const durationMin = Math.max(15, endMin - startMin);
        return {
          task,
          startMin,
          endMin: startMin + durationMin,
          durationMin,
        };
      })
    );
  }, [dayTasks]);

  const openEdit = (taskId: string) => {
    dispatch(setEditModalTaskId(taskId));
    dispatch(setEventModalOpen(true));
  };

  const openCreateAtSlot = (dateKey: string, hour: number) => {
    if (!canCreateAt(dateKey, `${String(hour).padStart(2, '0')}:00`)) return;
    if (!currentUser) {
      dispatch(setAuthModalOpen(true));
      return;
    }
    dispatch(setEditModalTaskId(null));
    dispatch(setEventModalSelectedDate(dateKey));
    dispatch(setEventModalSelectedTime(formatHourLabel(hour)));
    dispatch(setEventModalOpen(true));
  };

  const hasConflictInDay = (dateKey: string, startMin: number, endMin: number, excludeId?: string) => {
    return hasTimeConflict({
      tasks: tasksByDate[dateKey] ?? [],
      dateKey,
      startTime: minutesToTime(startMin),
      endTime: minutesToTime(endMin),
      excludeTaskId: excludeId ?? null,
    });
  };

  const computeMinutesFromColumnY = (dayIndex: number, clientY: number) => {
    const col = columnRefs.current[dayIndex];
    if (!col) return 9 * 60;
    const rect = col.getBoundingClientRect();
    const y = clamp(0, clientY - rect.top, rect.height || 1);
    const minutesPerPx = (HOURS * 60) / (rect.height || 1);
    const rawMin = y * minutesPerPx;
    return clamp(0, snapToStep(rawMin, STEP_MIN), HOURS * 60);
  };

  useEffect(() => {
    if (!resize) return;

    const onMove = (e: MouseEvent) => {
      const deltaY = e.clientY - resize.startY;
      const minutesPerPx = (HOURS * 60) / resize.columnHeight;
      const deltaMinRaw = deltaY * minutesPerPx;

      const minDuration = MIN_DURATION_MIN;
      const initialStart = resize.initialStartMin;
      const initialEnd = resize.initialEndMin;

      let newStart = initialStart;
      let newEnd = initialEnd;

      if (resize.edge === 'top') {
        newStart = snapToStep(initialStart + deltaMinRaw, STEP_MIN);
        newStart = Math.max(0, Math.min(newStart, newEnd - minDuration));
      } else {
        newEnd = snapToStep(initialEnd + deltaMinRaw, STEP_MIN);
        newEnd = Math.min(HOURS * 60, Math.max(newEnd, newStart + minDuration));
      }

      setTimeOverrides((prev) => ({
        ...prev,
        [resize.taskId]: {
          startTime: minutesToTime(newStart),
          endTime: minutesToTime(newEnd),
        },
      }));
    };

    const onUp = async () => {
      const override = timeOverridesRef.current[resize.taskId];
      const task = dayTasks[resize.dayIndex]?.tasks.find((t) => t._id === resize.taskId);
      setResize(null);

      if (!override || !task) return;
      if (override.startTime === (task.startTime ?? '') && override.endTime === (task.endTime ?? '')) return;

      // Prevent overlapping events on the same day
      const dateKey = dayTasks[resize.dayIndex]?.dateKey;
      if (dateKey) {
        const newStart = parseTimeToMinutesOrDefault(override.startTime, 9 * 60);
        const newEndRaw = parseTimeToMinutesOrDefault(override.endTime, newStart + 60);
        const newEnd = Math.max(newStart + MIN_DURATION_MIN, newEndRaw);
        if (hasConflictInDay(dateKey, newStart, newEnd, task._id)) {
          // Conflict: keep UI responsive, just revert preview.
          dispatch(openConflictModal({
            dateKey,
            startTime: minutesToTime(newStart),
            endTime: minutesToTime(newEnd),
            excludeTaskId: task._id,
          }));
          // Revert preview to original task times
          setTimeOverrides((prev) => ({
            ...prev,
            [task._id]: {
              startTime: task.startTime ?? '09:00',
              endTime: task.endTime ?? '10:00',
            },
          }));
          return;
        }
      }

      await dispatch(
        updateTask({
          id: resize.taskId,
          payload: {
            startTime: override.startTime,
            endTime: override.endTime,
          },
        })
      );
    };

    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp, { once: true });
    return () => {
      window.removeEventListener('mousemove', onMove);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resize]);

  const startResize = (
    e: React.MouseEvent,
    task: TaskItem,
    dayIndex: number,
    edge: ResizeEdge
  ) => {
    e.preventDefault();
    e.stopPropagation();

    const col = columnRefs.current[dayIndex];
    if (!col) return;
    const rect = col.getBoundingClientRect();
    const columnHeight = rect.height || 1;

    const startMin = parseTimeToMinutesOrDefault(task.startTime, 9 * 60);
    const endMin = task.endTime
      ? parseTimeToMinutesOrDefault(task.endTime, startMin + 60)
      : startMin + 60;
    const normalizedEnd = Math.max(startMin + MIN_DURATION_MIN, endMin);

    setResize({
      taskId: task._id,
      dayIndex,
      edge,
      startY: e.clientY,
      columnHeight,
      initialStartMin: startMin,
      initialEndMin: Math.min(HOURS * 60, normalizedEnd),
    });

    // Seed preview immediately
    setTimeOverrides((prev) => ({
      ...prev,
      [task._id]: {
        startTime: minutesToTime(startMin),
        endTime: minutesToTime(normalizedEnd),
      },
    }));
  };

  return (
    <WeekViewWrap>
      <WeekGrid>
        <WeekCorner />
        {cells.map((cell, i) => (
          <WeekDayHeader
            key={cell.dateKey}
            $gridColumn={i + 2}
          >
            <WeekDayHeaderInner>
              <WeekDayDateBadge $isToday={cell.dateKey === todayKey}>
                {cell.label}
              </WeekDayDateBadge>
            </WeekDayHeaderInner>
          </WeekDayHeader>
        ))}
        {Array.from({ length: HOURS }, (_, h) => (
          <WeekTimeLabel
            key={h}
            $gridRow={h + 2}
          >
            {formatHourLabel(h)}
          </WeekTimeLabel>
        ))}
        {cells.map((cell, dayIndex) => (
          // Disallow creating/dropping events in the past (by day)
          <WeekDayColumn
            key={cell.dateKey}
            $gridColumn={dayIndex + 2}
            $isToday={cell.dateKey === todayKey}
            $disabled={isPastDayRule(cell.dateKey)}
            ref={(el) => {
              columnRefs.current[dayIndex] = el;
            }}
            onDragOver={(e) => {
              if (isPastDayRule(cell.dateKey)) return;
              e.preventDefault();
              e.dataTransfer.dropEffect = 'move';
              e.currentTarget.classList.add('drag-over');

              if (!draggingTask || !currentUser) return;
              if (!canEditTask(currentUser, draggingTask)) return;

              const startOld = parseTimeToMinutesOrDefault(draggingTask.startTime, 9 * 60);
              const endOld = draggingTask.endTime
                ? parseTimeToMinutesOrDefault(draggingTask.endTime, startOld + 60)
                : startOld + 60;
              const durationMin = Math.max(MIN_DURATION_MIN, endOld - startOld);
              const newStart = computeMinutesFromColumnY(dayIndex, e.clientY);
              const newEnd = clamp(
                newStart + MIN_DURATION_MIN,
                newStart + durationMin,
                HOURS * 60
              );
              const topPct = (newStart / (HOURS * 60)) * 100;
              const heightPct = ((newEnd - newStart) / (HOURS * 60)) * 100;
              const colors =
                (draggingTask.labels && draggingTask.labels.length > 0)
                  ? draggingTask.labels
                  : [DEFAULT_LABEL_COLOR];

              setDragPreview({
                dayIndex,
                topPct,
                heightPct,
                taskForRender: { ...draggingTask, date: cell.dateKey, startTime: minutesToTime(newStart), endTime: minutesToTime(newEnd) },
                labelColors: colors,
                durationMin,
              });
            }}
            onDragLeave={(e) => {
              e.currentTarget.classList.remove('drag-over');
              setDragPreview(null);
            }}
            onDrop={async (e) => {
              if (isPastDayRule(cell.dateKey)) return;
              if (!currentUser) {
                dispatch(setAuthModalOpen(true));
                return;
              }
              e.preventDefault();
              e.currentTarget.classList.remove('drag-over');
              setDragPreview(null);
              const data = readDragEventPayload(e);
              if (!data) return;
              const { eventId, dateKey: fromDate } = data;

              const task = (tasksByDate[fromDate] ?? []).find((t) => t._id === eventId);
              if (!task) return;
              if (!canEditTask(currentUser, task)) return;

              const startOld = parseTimeToMinutesOrDefault(task.startTime, 9 * 60);
              const endOld = task.endTime
                ? parseTimeToMinutesOrDefault(task.endTime, startOld + 60)
                : startOld + 60;
              const duration = Math.max(MIN_DURATION_MIN, endOld - startOld);

              const newStart = computeMinutesFromColumnY(dayIndex, e.clientY);
              const newEnd = clamp(
                newStart + MIN_DURATION_MIN,
                newStart + duration,
                HOURS * 60
              );

              if (cell.dateKey === todayKey) {
                const now = new Date();
                const nowMin = nowMinutes(now);
                if (newStart < nowMin) {
                  dispatch(pushToast({ kind: 'warning', title: t('weekView.timePassedTitle'), description: t('weekView.timePassedMessage') }));
                  return;
                }
              }

              if (hasConflictInDay(cell.dateKey, newStart, newEnd, task._id)) {
                dispatch(openConflictModal({
                  dateKey: cell.dateKey,
                  startTime: minutesToTime(newStart),
                  endTime: minutesToTime(newEnd),
                  excludeTaskId: task._id,
                }));
                return;
              }

              await dispatch(
                updateTask({
                  id: task._id,
                  payload: {
                    date: cell.dateKey,
                    startTime: minutesToTime(newStart),
                    endTime: minutesToTime(newEnd),
                  },
                })
              );
            }}
          >
            {dragPreview && dragPreview.dayIndex === dayIndex && (
              <CalendarEventGhost
                variant="week"
                task={dragPreview.taskForRender}
                labelColors={dragPreview.labelColors}
                topPct={dragPreview.topPct}
                heightPct={dragPreview.heightPct}
                showTime
                layout={dragPreview.durationMin <= 60 ? 'compact' : 'default'}
              />
            )}
            {Array.from({ length: HOURS }, (_, h) => (
              <WeekHourSlot
                key={h}
                onClick={() => openCreateAtSlot(cell.dateKey, h)}
                title={t('weekView.createEventAt', { time: formatHourLabel(h) })}
                $disabled={isPastDayRule(cell.dateKey)}
              />
            ))}
            {eventsByDay[dayIndex]?.map(({ task, startMin, durationMin }) => {
              const override = timeOverrides[task._id];
              const startMinEff = override
                ? parseTimeToMinutesOrDefault(override.startTime, 9 * 60)
                : startMin;
              const endMinEff = override
                ? parseTimeToMinutesOrDefault(override.endTime, startMinEff + 60)
                : startMin + durationMin;
              const durationMinEff = Math.max(15, endMinEff - startMinEff);

              const topPct = (startMinEff / (HOURS * 60)) * 100;
              const heightPct = (durationMinEff / (HOURS * 60)) * 100;
              const colors =
                (task.labels && task.labels.length > 0)
                  ? task.labels
                  : [DEFAULT_LABEL_COLOR];
              const taskForRender: TaskItem = override
                ? { ...task, startTime: override.startTime, endTime: override.endTime }
                : task;
              const isPast = isTaskInPast(taskForRender, new Date());
              const canDrag = !isPast && canEditTask(currentUser, task);
              return (
                <CalendarEventItem
                  key={task._id}
                  variant="week"
                  task={task}
                  taskForRender={taskForRender}
                  labelColors={colors}
                  showTime
                  layout={durationMinEff <= 60 ? 'compact' : 'default'}
                  isPast={isPast}
                  allowDrag={canDrag}
                  topPct={topPct}
                  heightPct={heightPct}
                  onClick={(e) => {
                    if (isDraggingRef.current) return;
                    e.stopPropagation();
                    openEdit(task._id);
                  }}
                >
                  {canEditTask(currentUser, task) && (
                    <>
                      <WeekEventResizeHandle
                        $edge="top"
                        onMouseDown={(e) => startResize(e, task, dayIndex, 'top')}
                        title={t('weekView.adjustStart')}
                      />
                      <WeekEventResizeHandle
                        $edge="bottom"
                        onMouseDown={(e) => startResize(e, task, dayIndex, 'bottom')}
                        title={t('weekView.adjustEnd')}
                      />
                    </>
                  )}
                </CalendarEventItem>
              );
            })}
          </WeekDayColumn>
        ))}
      </WeekGrid>
    </WeekViewWrap>
  );
}
