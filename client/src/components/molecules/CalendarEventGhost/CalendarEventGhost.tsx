import type { TaskItem } from '@/features/calendar/types';
import { EventCardContent } from '@/components/molecules/EventCardContent';
import { GhostMonth, GhostWeek } from './CalendarEventGhost.styled';
import type { CalendarEventVariant } from '@/components/molecules/CalendarEventItem';

interface CalendarEventGhostProps {
  variant: CalendarEventVariant;
  task: TaskItem;
  labelColors: string[];
  /** Week-only positioning */
  topPct?: number;
  heightPct?: number;
  layout?: 'default' | 'compact';
  showTime?: boolean;
}

export function CalendarEventGhost({
  variant,
  task,
  labelColors,
  topPct,
  heightPct,
  layout = 'default',
  showTime,
}: CalendarEventGhostProps) {
  if (variant === 'month') {
    return (
      <GhostMonth aria-hidden>
        <EventCardContent task={task} labelColors={labelColors} layout={layout} showTime={showTime} />
      </GhostMonth>
    );
  }

  return (
    <GhostWeek
      aria-hidden
      $variant="week"
      $canDrag={false}
      $topPct={topPct}
      $heightPct={heightPct}
    >
      <EventCardContent task={task} labelColors={labelColors} layout={layout} showTime={showTime} />
    </GhostWeek>
  );
}

