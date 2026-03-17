import styled from '@emotion/styled';
import { theme } from '@/shared/styles/theme';

/** First row = weekdays (auto height), next 6 rows = days (equal height, fill screen). */
const CALENDAR_GRID_MIN_HEIGHT = 400;

export const Grid = styled.div<{ $minHeight?: number }>`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  grid-template-rows: auto repeat(6, minmax(0, 1fr));
  flex: 1;
  min-height: ${(p) => {
    const custom = p.$minHeight ?? CALENDAR_GRID_MIN_HEIGHT;
    return `${custom}px`;
  }};
  overflow: auto;
  background: ${theme.colors.white};
`;
