import styled from '@emotion/styled';
import { theme } from '@/shared/styles/theme';

/** Figma: border-r border-b border-gray-200 p-2, bg-gray-50/white, hover:bg-gray-100 */
export const Cell = styled.div<{ $isCurrentMonth: boolean; $isToday?: boolean }>`
  min-height: 0;
  background: ${(p) => {
    if (p.$isToday) return '#faf6f0';
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
`;

export const DayRow = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: ${theme.spacing[1.5]};
  margin-bottom: ${theme.spacing[2]};
  flex-shrink: 0;
`;

export const DayNumber = styled.span<{ $isCurrentMonth: boolean; $isToday?: boolean }>`
  font-size: ${theme.font.size.sm};
  font-weight: ${(p) => (p.$isToday ? theme.font.weight.semibold : theme.font.weight.medium)};
  color: ${(p) => {
    if (p.$isToday) return theme.colors.gray[800];
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
  margin-bottom: ${theme.spacing[1.5]};
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

export const HolidayPill = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 10px;
  line-height: 1.3;
  color: #92400e;
  background: #fef3c7;
  border: 1px solid #fcd34d;
  border-radius: ${theme.radius.sm};
  padding: 2px 6px;
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const HolidayPillMore = styled.span`
  font-size: 10px;
  color: ${theme.colors.gray[500]};
  padding-left: 2px;
`;

/** Figma: space-y-1 (gap 4px) between cards; click opens event modal */
export const TasksList = styled.div`
  flex: 1;
  min-height: 0;
  overflow: auto;
  display: flex;
  flex-direction: column;
  gap: 4px;
  cursor: pointer;
`;
