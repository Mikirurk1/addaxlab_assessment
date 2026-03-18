import styled from '@emotion/styled';
import { theme } from '@/shared/styles/theme';

const HOURS = 24;
const ROW_HEIGHT = 48;

export const WeekViewWrap = styled.div`
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
  overflow: auto;
  background: ${theme.colors.white};
`;

export const WeekGrid = styled.div`
  display: grid;
  grid-template-columns: 48px repeat(7, 1fr);
  grid-template-rows: auto repeat(${HOURS}, minmax(${ROW_HEIGHT}px, 1fr));
  min-height: ${HOURS * ROW_HEIGHT}px;
  flex: 1;
`;

export const WeekCorner = styled.div`
  border-right: 1px solid ${theme.colors.gray[200]};
  border-bottom: 1px solid ${theme.colors.gray[200]};
  background: ${theme.colors.gray[50]};
`;

export const WeekDayHeader = styled.div<{ $gridColumn: number }>`
  grid-column: ${(p) => p.$gridColumn};
  grid-row: 1;
  padding: ${theme.spacing[2]};
  font-size: ${theme.font.size.sm};
  font-weight: ${theme.font.weight.medium};
  color: ${theme.colors.gray[600]};
  text-align: center;
  border-right: 1px solid ${theme.colors.gray[200]};
  border-bottom: 1px solid ${theme.colors.gray[200]};
  background: ${theme.colors.gray[50]};
  &:last-of-type {
    border-right: none;
  }
`;

export const WeekDayHeaderInner = styled.div`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
`;

export const WeekDayDateBadge = styled.span<{ $isToday?: boolean }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: ${(p) => (p.$isToday ? '24px' : 'auto')};
  height: ${(p) => (p.$isToday ? '24px' : 'auto')};
  border-radius: 9999px;
  padding: ${(p) => (p.$isToday ? '0' : '0')};
  background: ${(p) => (p.$isToday ? theme.colors.orange[600] : 'transparent')};
  color: ${(p) => (p.$isToday ? theme.colors.white : theme.colors.gray[600])};
  font-weight: ${(p) => (p.$isToday ? theme.font.weight.semibold : theme.font.weight.medium)};
`;

export const WeekTimeLabel = styled.div<{ $gridRow: number }>`
  grid-column: 1;
  grid-row: ${(p) => p.$gridRow};
  padding: 2px 8px;
  font-size: ${theme.font.size.xs};
  color: ${theme.colors.gray[500]};
  border-right: 1px solid ${theme.colors.gray[200]};
  border-bottom: 1px solid ${theme.colors.gray[100]};
  background: ${theme.colors.white};
`;

export const WeekDayColumn = styled.div<{ $gridColumn: number; $isToday?: boolean; $disabled?: boolean }>`
  position: relative;
  grid-column: ${(p) => p.$gridColumn};
  grid-row: 2 / -1;
  display: flex;
  flex-direction: column;
  border-right: 1px solid ${theme.colors.gray[200]};
  background: ${(p) =>
    p.$isToday ? '#faf6f0' : p.$disabled ? theme.colors.gray[100] : theme.colors.white};
  min-height: 0;
  &:last-of-type {
    border-right: none;
  }
  &.drag-over {
    background: #bbdefb;
    outline: 2px dashed #1976d2;
    outline-offset: -2px;
  }
  ${(p) =>
    p.$disabled &&
    `
      opacity: 0.9;
    `}
`;

export const WeekHourSlot = styled.div<{ $disabled?: boolean }>`
  flex: 1;
  min-height: ${ROW_HEIGHT}px;
  border-bottom: 1px solid ${theme.colors.gray[100]};
  cursor: pointer;
  position: relative;
  z-index: 1;
  &:hover {
    background: ${theme.colors.gray[50]};
  }
  ${(p) =>
    p.$disabled &&
    `
      cursor: default;
      &:hover {
        background: transparent;
      }
    `}
`;

export const WeekEventResizeHandle = styled.div<{ $edge: 'top' | 'bottom' }>`
  position: absolute;
  left: 0;
  right: 0;
  height: 10px;
  cursor: ns-resize;
  z-index: 2;
  ${(p) => (p.$edge === 'top' ? 'top: 0;' : 'bottom: 0;')}
  /* Slight affordance on hover (doesn't change layout) */
  &:hover {
    background: rgba(249, 115, 22, 0.10);
  }
`;
