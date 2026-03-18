import styled from '@emotion/styled';
import { theme } from '@/shared/styles/theme';
import { EventItemWrap } from '@/components/molecules/CalendarEventItem/CalendarEventItem.styled';

export const GhostMonth = styled.div`
  border-radius: ${theme.radius.md};
  border: 1px dashed ${theme.colors.orange[500]};
  background: rgba(249, 115, 22, 0.08);
  box-shadow: ${theme.shadow.sm};
  opacity: 0.85;
  pointer-events: none;
  padding: ${theme.spacing[2]};
  min-height: 54px;
`;

export const GhostWeek = styled(EventItemWrap)`
  opacity: 0.7;
  border: 1px dashed ${theme.colors.orange[500]};
  background: rgba(249, 115, 22, 0.08);
  pointer-events: none;
  z-index: 3;
`;

