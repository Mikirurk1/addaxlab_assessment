import styled from '@emotion/styled';
import { theme } from '@/shared/styles/theme';
import { CardBase } from '@/components/atoms/Card';

export const EventItemWrap = styled(CardBase)<{
  $variant: 'month' | 'week';
  $isDragging?: boolean;
  $isHidden?: boolean;
  $isPast?: boolean;
  $compact?: boolean;
  $canDrag?: boolean;
  $topPct?: number;
  $heightPct?: number;
}>`
  cursor: ${(p) => (p.$canDrag ? 'grab' : 'pointer')};
  user-select: none;
  transition: box-shadow 0.15s, border-color 0.15s;

  ${(p) =>
    p.$variant === 'month' &&
    `
      min-height: ${p.$compact ? '28px' : '54px'};
      padding: ${p.$compact ? theme.spacing[1.5] : theme.spacing[2]};
      opacity: ${p.$isHidden ? 0.45 : p.$isPast ? 0.55 : 1};
    `}

  ${(p) =>
    p.$variant === 'week' &&
    `
      position: absolute;
      left: 4px;
      right: 4px;
      top: ${p.$topPct ?? 0}%;
      height: ${p.$heightPct ?? 0}%;
      padding: ${theme.spacing[2]};
      box-sizing: border-box;
      z-index: 2;
      display: flex;
      flex-direction: column;
      opacity: ${p.$isPast ? 0.55 : 1};
      color: ${theme.colors.gray[700]};
      font-size: ${theme.font.size.xs};
      font-weight: ${theme.font.weight.medium};
    `}

  ${(p) =>
    p.$isDragging &&
    `opacity: 0.9; cursor: grabbing; box-shadow: ${theme.shadow.md}; border-color: ${theme.colors.gray[300]};`}
  ${(p) => p.$isPast && 'cursor: default;'}

  &:active {
    cursor: ${(p) => (p.$canDrag ? 'grabbing' : 'pointer')};
  }
  &.dragging {
    cursor: grabbing;
  }
  &:hover {
    box-shadow: ${theme.shadow.md};
    border-color: ${theme.colors.gray[300]};
  }

  /* Stretch card body to fill slot height (week) */
  & [data-event-card-body] {
    flex: 1;
    min-height: 0;
  }
  /* If compact (<= 1h), center content vertically (week) */
  & [data-event-card-compact] {
    display: flex;
    align-items: center;
    justify-content: center;
  }
`;

