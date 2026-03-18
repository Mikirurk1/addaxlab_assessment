import styled from '@emotion/styled';
import { theme } from '@/shared/styles/theme';
import {
  LabelsStrip,
  LabelSegment,
  CardBody,
  CardTime,
  CardTitle,
} from '@/components/molecules/EventCardParts/EventCardParts.styled';
import type { TaskItem } from '@/features/calendar/types';

const CompactRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-width: 0;
  width: 100%;
  gap: 6px;
`;

const CompactLeft = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  min-width: 0;
  flex: 1;
`;

const CompactDots = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 3px;
  flex-shrink: 0;
`;

const CompactDot = styled.span<{ $color: string }>`
  width: 6px;
  height: 6px;
  border-radius: 9999px;
  background: ${(p) => p.$color};
`;

const CompactTime = styled.span`
  font-size: 10px;
  color: ${theme.colors.gray[500]};
  line-height: 1.2;
  flex-shrink: 0;
`;

const CompactTitle = styled.span`
  font-size: ${theme.font.size.xs};
  font-weight: ${theme.font.weight.normal};
  color: ${theme.colors.gray[700]};
  line-height: 1.25;
  flex: 1;
  min-width: 0;
  text-align: left;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

interface EventCardContentProps {
  task: TaskItem;
  labelColors: string[];
  /** Show start/end time (for week view) */
  showTime?: boolean;
  /** Compact single-row layout (for very short events in week) */
  layout?: 'default' | 'compact';
}

export function EventCardContent({
  task,
  labelColors,
  showTime,
  layout = 'default',
}: EventCardContentProps) {
  const timeText =
    showTime && (task.startTime || task.endTime)
      ? `${task.startTime || '–'}${task.endTime ? ` – ${task.endTime}` : ''}`
      : null;

  if (layout === 'compact') {
    return (
      <CardBody
        data-event-card-body={showTime ? true : undefined}
        data-event-card-compact
      >
        <CompactRow>
          <CompactLeft>
            <CompactTitle title={task.title}>{task.title}</CompactTitle>
            {timeText && <CompactTime>{timeText}</CompactTime>}
          </CompactLeft>
          <CompactDots aria-hidden>
            {labelColors.slice(0, 5).map((color, i) => (
              <CompactDot key={`${color}-${i}`} $color={color} />
            ))}
          </CompactDots>
        </CompactRow>
      </CardBody>
    );
  }

  return (
    <>
      <LabelsStrip>
        {labelColors.map((color, i) => (
          <LabelSegment key={`${color}-${i}`} $color={color} />
        ))}
      </LabelsStrip>
      <CardBody data-event-card-body={showTime ? true : undefined}>
        {timeText && (
          <CardTime>
            {timeText}
          </CardTime>
        )}
        <CardTitle>{task.title}</CardTitle>
      </CardBody>
    </>
  );
}
