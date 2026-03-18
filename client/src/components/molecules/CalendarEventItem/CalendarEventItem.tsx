import { useMemo } from 'react';
import { useDispatch } from 'react-redux';
import { EventItemWrap } from './CalendarEventItem.styled';
import { EventCardContent } from '@/components/molecules/EventCardContent';
import { setEditModalTaskId, setEventModalOpen, setDraggingTaskId } from '@/features/calendar/model';
import { setDragEventPayload } from '@/features/calendar/dnd/dragPayload';
import type { TaskItem } from '@/features/calendar/types';
import { useT } from '@/features/i18n';

export type CalendarEventVariant = 'month' | 'week';

interface CalendarEventItemProps {
  variant: CalendarEventVariant;
  task: TaskItem;
  /** Use different data for rendering (e.g. week time overrides) */
  taskForRender?: TaskItem;
  labelColors: string[];
  isHidden?: boolean;
  isPast?: boolean;
  allowDrag?: boolean;
  layout?: 'default' | 'compact';
  showTime?: boolean;

  /** Week-only positioning */
  topPct?: number;
  heightPct?: number;

  /** Month-only drop helpers */
  onDropAt?: (e: React.DragEvent, index: number) => void;
  onDragHover?: (e: React.DragEvent, index: number) => void;
  onDragLeave?: () => void;
  index?: number;

  /** Optional extra overlays (e.g. resize handles in week) */
  children?: React.ReactNode;

  /** Override click behavior (otherwise opens edit modal) */
  onClick?: (e: React.MouseEvent) => void;
  title?: string;
}

export function CalendarEventItem({
  variant,
  task,
  taskForRender,
  labelColors,
  isHidden,
  isPast,
  allowDrag = true,
  layout = 'default',
  showTime,
  topPct,
  heightPct,
  onDropAt,
  onDragHover,
  onDragLeave,
  index,
  children,
  onClick,
  title,
}: CalendarEventItemProps) {
  const dispatch = useDispatch();
  const t = useT();
  const canDrag = !isPast && allowDrag;
  const canDrop = !isPast;

  const defaultTitle = useMemo(() => {
    const start = task.startTime ? ` ${task.startTime}` : '';
    const end = task.endTime ? ` – ${task.endTime}` : '';
    return `${task.title}${start}${end}`;
  }, [task.title, task.startTime, task.endTime]);

  const handleClick = (e: React.MouseEvent) => {
    if (onClick) return onClick(e);
    e.stopPropagation();
    dispatch(setEditModalTaskId(task._id));
    dispatch(setEventModalOpen(true));
  };

  const handleDragStart = (e: React.DragEvent) => {
    if (!canDrag) return;
    setDragEventPayload(e, { eventId: task._id, dateKey: task.date });
    (e.target as HTMLElement).classList.add('dragging');
    dispatch(setDraggingTaskId(task._id));
  };

  const handleDragEnd = (e: React.DragEvent) => {
    (e.target as HTMLElement).classList.remove('dragging');
    dispatch(setDraggingTaskId(null));
  };

  return (
    <EventItemWrap
      data-event-item
      draggable={canDrag}
      $variant={variant}
      $canDrag={canDrag}
      $isHidden={isHidden}
      $isPast={isPast}
      $compact={layout === 'compact'}
      $topPct={topPct}
      $heightPct={heightPct}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragOver={(e) => {
        if (!canDrop) return;
        if (variant !== 'month') return;
        if (typeof index !== 'number') return;
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
        onDragHover?.(e, index);
      }}
      onDragLeave={() => {
        if (variant !== 'month') return;
        onDragLeave?.();
      }}
      onDrop={(e) => {
        if (!canDrop) return;
        if (variant !== 'month') return;
        if (typeof index !== 'number') return;
        e.preventDefault();
        onDropAt?.(e, index);
      }}
      onClick={handleClick}
      title={title ?? (variant === 'week' ? defaultTitle : t('taskCard.editHint'))}
    >
      {children}
      <EventCardContent
        task={taskForRender ?? task}
        labelColors={labelColors}
        layout={layout}
        showTime={showTime}
      />
    </EventItemWrap>
  );
}

