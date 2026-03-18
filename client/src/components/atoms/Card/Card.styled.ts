import styled from '@emotion/styled';
import { theme } from '@/shared/styles/theme';

export const CardBase = styled.div`
  background: ${theme.colors.white};
  border-radius: ${theme.radius.md};
  overflow: hidden;
  border: 1px solid ${theme.colors.gray[200]};
  box-shadow: ${theme.shadow.sm};
  transition: box-shadow 0.15s, border-color 0.15s, transform 0.15s;
`;

