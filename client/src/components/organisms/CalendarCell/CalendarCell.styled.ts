import styled from '@emotion/styled';
import { theme } from '@/shared/styles/theme';

/** Figma: border-r border-b border-gray-200 p-2, bg-gray-50/white, hover:bg-gray-100 */
export const Cell = styled.div<{ $isCurrentMonth: boolean; $isToday?: boolean; $disabled?: boolean }>`
  min-height: 0;
  background: ${(p) => {
    if (p.$isToday) return '#faf6f0';
    if (p.$disabled) return theme.colors.gray[100];
    return p.$isCurrentMonth ? theme.colors.gray[50] : theme.colors.white;
  }};
  padding: ${theme.spacing[2]};
  display: flex;
  flex-direction: column;
  border-right: 1px solid ${theme.colors.gray[200]};
  border-bottom: 1px solid ${theme.colors.gray[200]};
  cursor: pointer;
  overflow: hidden;
  transition: background 0.15s;
  &:nth-of-type(7n) {
    border-right: none;
  }
  &:hover {
    background: ${(p) => (p.$isToday ? '#f5f0e8' : theme.colors.gray[100])};
  }
  &.drag-over {
    background: #bbdefb;
    outline: 2px dashed #1976d2;
    outline-offset: -2px;
  }
  ${(p) =>
    p.$disabled &&
    `
      cursor: default;
      opacity: 0.85;
      &:hover {
        background: ${theme.colors.gray[100]};
      }
    `}
`;

export const DayRow = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: ${theme.spacing[1.5]};
  margin-bottom: ${theme.spacing[2]};
  flex-shrink: 0;
`;

export const ScrollArea = styled.div<{ $disabled?: boolean }>`
  flex: 1;
  min-height: 0;
  overflow: auto;
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing[1.5]};
  cursor: ${(p) => (p.$disabled ? 'default' : 'pointer')};
`;

export const DayNumber = styled.span<{ $isCurrentMonth: boolean; $isToday?: boolean }>`
  font-size: ${theme.font.size.sm};
  font-weight: ${(p) => (p.$isToday ? theme.font.weight.semibold : theme.font.weight.medium)};
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: ${(p) => (p.$isToday ? '24px' : 'auto')};
  height: ${(p) => (p.$isToday ? '24px' : 'auto')};
  border-radius: 9999px;
  background: ${(p) => (p.$isToday ? theme.colors.orange[600] : 'transparent')};
  color: ${(p) => {
    if (p.$isToday) return theme.colors.white;
    return p.$isCurrentMonth ? theme.colors.gray[900] : theme.colors.gray[400];
  }};
`;

export const CardCount = styled.span`
  font-size: ${theme.font.size.xs};
  color: ${theme.colors.gray[500]};
  background: ${theme.colors.white};
  padding: 2px 6px;
  border-radius: ${theme.radius.sm};
`;

export const HolidaysList = styled.div`
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

export const CountryCode = styled.span`
  color: #b45309;
  font-size: 9px;
`;

/** Figma: space-y-1 (gap 4px) between cards; click opens event modal */
export const TasksList = styled.div<{ $disabled?: boolean }>`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

export const GhostDropCard = styled.div`
  border-radius: ${theme.radius.md};
  border: 1px dashed ${theme.colors.orange[500]};
  background: rgba(249, 115, 22, 0.08);
  box-shadow: ${theme.shadow.sm};
  opacity: 0.85;
  pointer-events: none;
  padding: ${theme.spacing[2]};
  min-height: 54px;
`;
