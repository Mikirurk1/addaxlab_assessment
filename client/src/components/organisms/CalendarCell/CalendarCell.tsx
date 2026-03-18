import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store";
import {
  updateTask,
  reorderTasks,
  setEventModalOpen,
  setEventModalSelectedDate,
  setEventModalSelectedTime,
  setEditModalTaskId,
} from "@/features/calendar/model";
import { toDateKey } from "@/shared/utils/calendar";
import { openConflictModal } from "@/features/calendar/model";
import { setAuthModalOpen } from "@/features/auth/model";
import { isTaskInPast } from "@/features/calendar/lib/taskTimeRules";
import { isPastDay as isPastDayRule } from "@/features/calendar/lib/rules";
import { CalendarEventItem } from "@/components/molecules/CalendarEventItem";
import { CalendarEventGhost } from "@/components/molecules/CalendarEventGhost";
import { Pill } from "@/components/atoms/Pill";
import { LABEL_COLORS } from "@/components/atoms";
import { useT } from "@/features/i18n";
import { canEditTask } from "@/features/auth/lib/permissions";
import {
  Cell,
  DayRow,
  DayNumber,
  CardCount,
  ScrollArea,
  HolidaysList,
  CountryCode,
  TasksList,
} from "./CalendarCell.styled";
import type { TaskItem, PublicHoliday } from "@/features/calendar/types";
import { readDragEventPayload } from "@/features/calendar/dnd/dragPayload";

const CARD_LABEL_COLORS = LABEL_COLORS.map((c) => c.value);

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
  const currentUser = useAppSelector((s) => s.auth.user);
  const draggingTaskId = useAppSelector((s) => s.ui.draggingTaskId);
  const allTasks = useAppSelector((s) => s.tasks.items);
  const t = useT();
  const now = useMemo(() => new Date(), []);
  const isPastDay = isPastDayRule(dateKey, now);
  const draggingTask = useMemo(() => {
    if (!draggingTaskId) return null;
    return allTasks.find((t) => t._id === draggingTaskId) ?? null;
  }, [allTasks, draggingTaskId]);
  const [dragPreview, setDragPreview] = useState<{
    index: number;
    task: TaskItem;
  } | null>(null);
  const dragDepthRef = useRef(0);
  const tasksListRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (draggingTaskId) return;
    setDragPreview(null);
    dragDepthRef.current = 0;
  }, [draggingTaskId]);

  const filteredTasks = searchQuery.trim()
    ? tasks.filter((t) =>
        t.title.toLowerCase().includes(searchQuery.trim().toLowerCase()),
      )
    : tasks;
  const taskCount = filteredTasks.length;

  const minInsertIndex = useMemo(() => {
    let lastLocked = -1;
    for (let i = 0; i < filteredTasks.length; i++) {
      if (!canEditTask(currentUser, filteredTasks[i])) lastLocked = i;
    }
    return lastLocked + 1;
  }, [filteredTasks, currentUser]);

  const handleDrop = useCallback(
    async (e: React.DragEvent, insertIndex: number) => {
      if (!currentUser) {
        dispatch(setAuthModalOpen(true));
        return;
      }
      if (isPastDay) {
        dispatch(
          openConflictModal({
            kind: "warning",
            title: t("calendarCell.cannotMoveToPastTitle"),
            message: t("calendarCell.cannotMoveToPastMessage"),
          }),
        );
        return;
      }
      e.preventDefault();
      e.currentTarget.classList.remove("drag-over");
      const data = readDragEventPayload(e);
      if (!data) return;
      const { eventId: taskId, dateKey: fromDate } = data;
      const draggedFromStore = allTasks.find((t) => t._id === taskId) ?? null;
      // Always enforce permissions (drag can be initiated elsewhere).
      if (draggedFromStore && !canEditTask(currentUser, draggedFromStore)) return;

      const canReorderAllInDay = tasks.every((t) => canEditTask(currentUser, t));

      const computeOrderAt = (idx: number): number => {
        const list = filteredTasks;
        const prev = idx > 0 ? list[idx - 1] : null;
        const next = idx < list.length ? list[idx] : null;
        const prevOrder =
          prev ? (tasks.find((t) => t._id === prev._id)?.order ?? null) : null;
        const nextOrder =
          next ? (tasks.find((t) => t._id === next._id)?.order ?? null) : null;
        if (prevOrder != null && nextOrder != null) return (prevOrder + nextOrder) / 2;
        if (prevOrder != null) return prevOrder + 1;
        if (nextOrder != null) return nextOrder - 1;
        return 0;
      };

      if (fromDate === dateKey) {
        if (canReorderAllInDay) {
          const ids = tasks.map((t) => t._id);
          const fromIdx = ids.indexOf(taskId);
          if (fromIdx === -1) return;
          ids.splice(fromIdx, 1);
          ids.splice(insertIndex, 0, taskId);
          dispatch(reorderTasks({ date: dateKey, taskIds: ids }));
        } else {
          // Mixed ownership day: avoid reorder endpoint (server forbids including non-editable tasks).
          await dispatch(updateTask({ id: taskId, payload: { order: computeOrderAt(insertIndex) } }));
        }
      } else {
        if (canReorderAllInDay) {
          await dispatch(updateTask({ id: taskId, payload: { date: dateKey } }));
          const newIds = [
            ...tasks.slice(0, insertIndex).map((t) => t._id),
            taskId,
            ...tasks.slice(insertIndex).map((t) => t._id),
          ];
          dispatch(reorderTasks({ date: dateKey, taskIds: newIds }));
        } else {
          // Mixed ownership day: move + set floating order without reordering others.
          await dispatch(updateTask({ id: taskId, payload: { date: dateKey, order: computeOrderAt(insertIndex) } }));
        }
      }
      setDragPreview(null);
      dragDepthRef.current = 0;
    },
    [dateKey, tasks, filteredTasks, dispatch, isPastDay, currentUser, allTasks],
  );

  const handleCardDragHover = useCallback(
    (e: React.DragEvent, cardIndex: number) => {
      if (!draggingTask) return;

      const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
      const before = e.clientY < rect.top + rect.height / 2;
      const rawIndex = before ? cardIndex : cardIndex + 1;
      const index = Math.max(rawIndex, minInsertIndex);
      setDragPreview({ index, task: draggingTask });
    },
    [draggingTask, minInsertIndex],
  );

  const isToday = useMemo(() => dateKey === toDateKey(new Date()), [dateKey]);

  const handleCellAreaClick = useCallback(
    (e: React.MouseEvent) => {
      if (isPastDay) return;
      const el = e.target as HTMLElement;
      if (el.closest("[data-event-item]")) return;
      if (!currentUser) {
        dispatch(setAuthModalOpen(true));
        return;
      }
      dispatch(setEditModalTaskId(null));
      dispatch(setEventModalSelectedDate(dateKey));
      dispatch(setEventModalSelectedTime(null));
      dispatch(setEventModalOpen(true));
    },
    [dateKey, dispatch, isPastDay, currentUser],
  );

  return (
    <Cell
      $isCurrentMonth={isCurrentMonth}
      $isToday={isToday}
      $disabled={isPastDay}
      data-date-cell={dateKey}
      onClick={handleCellAreaClick}
      onDragEnter={() => {
        dragDepthRef.current += 1;
      }}
      onDragOver={(e) => {
        if (isPastDay) return;
        e.preventDefault();
        e.dataTransfer.dropEffect = "move";
        e.currentTarget.classList.add("drag-over");
        // If hovering outside the list (DayRow/empty cell area), default to first allowed slot.
        const inList = (e.target as HTMLElement).closest("[data-tasks-list]");
        if (!inList && draggingTask) setDragPreview({ index: minInsertIndex, task: draggingTask });
      }}
      onDragLeave={(e) => {
        dragDepthRef.current -= 1;
        if (dragDepthRef.current <= 0) {
          dragDepthRef.current = 0;
          e.currentTarget.classList.remove("drag-over");
          setDragPreview(null);
        }
      }}
      onDrop={(e) =>
        handleDrop(
          e,
          Math.max(dragPreview?.index ?? filteredTasks.length, minInsertIndex),
        )
      }
    >
      <DayRow>
        <DayNumber $isCurrentMonth={isCurrentMonth} $isToday={isToday}>
          {dayLabel}
        </DayNumber>
        {taskCount > 0 && (
          <CardCount>
            {t(
              taskCount === 1
                ? "calendarCell.cardsCountSingular"
                : "calendarCell.cardsCountPlural",
              { count: taskCount },
            )}
          </CardCount>
        )}
      </DayRow>
      <ScrollArea
        $disabled={isPastDay}
        title={t("calendarCell.scrollToSeeAll")}
      >
        {holidays.length > 0 && (
          <HolidaysList>
            {holidays.map((h, idx) => (
              <Pill
                key={`${h.date}-${h.countryCode}-${h.name}-${h.localName ?? ""}-${idx}`}
                title={`${h.localName || h.name} (${h.countryCode})`}
                tone="holiday"
              >
                {h.localName || h.name}
                <CountryCode>({h.countryCode})</CountryCode>
              </Pill>
            ))}
          </HolidaysList>
        )}
        <TasksList
          ref={tasksListRef}
          data-tasks-list
          onDragOver={(e) => {
            if (!draggingTask) return;
            e.preventDefault();
            const listEl = tasksListRef.current;
            if (!listEl) {
              setDragPreview({ index: minInsertIndex, task: draggingTask });
              return;
            }
            const items = Array.from(listEl.querySelectorAll<HTMLElement>("[data-event-item]"));
            const mouseY = e.clientY;
            let rawIndex = items.length;
            for (let i = 0; i < items.length; i++) {
              const r = items[i]!.getBoundingClientRect();
              const mid = r.top + r.height / 2;
              if (mouseY < mid) {
                rawIndex = i;
                break;
              }
            }
            const index = Math.max(rawIndex, minInsertIndex);
            setDragPreview({ index, task: draggingTask });
          }}
        >
          {filteredTasks.map((task, i) => (
            <div key={task._id}>
              {dragPreview?.index === i && dragPreview.task && (
                <CalendarEventGhost
                  variant="month"
                  task={dragPreview.task}
                  labelColors={
                    dragPreview.task.labels && dragPreview.task.labels.length > 0
                      ? dragPreview.task.labels
                      : [
                          CARD_LABEL_COLORS[
                            dragPreview.task._id
                              .split("")
                              .reduce((s, c) => s + c.charCodeAt(0), 0) %
                              CARD_LABEL_COLORS.length
                          ],
                        ]
                  }
                />
              )}
              <CalendarEventItem
                variant="month"
                task={task}
                index={i}
                allowDrag={canEditTask(currentUser, task)}
                labelColors={
                  task.labels && task.labels.length > 0
                    ? task.labels
                    : [
                        CARD_LABEL_COLORS[
                          task._id
                            .split("")
                            .reduce((s, c) => s + c.charCodeAt(0), 0) %
                            CARD_LABEL_COLORS.length
                        ],
                      ]
                }
                isHidden={
                  searchQuery.trim() !== "" &&
                  !task.title
                    .toLowerCase()
                    .includes(searchQuery.trim().toLowerCase())
                }
                isPast={isTaskInPast(task, now)}
                showTime
                onDropAt={(e, idx) => handleDrop(e, idx)}
                onDragHover={handleCardDragHover}
              />
            </div>
          ))}
          {dragPreview?.index === filteredTasks.length && dragPreview.task && (
            <CalendarEventGhost
              variant="month"
              task={dragPreview.task}
              labelColors={
                dragPreview.task.labels && dragPreview.task.labels.length > 0
                  ? dragPreview.task.labels
                  : [
                      CARD_LABEL_COLORS[
                        dragPreview.task._id
                          .split("")
                          .reduce((s, c) => s + c.charCodeAt(0), 0) %
                          CARD_LABEL_COLORS.length
                      ],
                    ]
              }
            />
          )}
        </TasksList>
      </ScrollArea>
    </Cell>
  );
}
