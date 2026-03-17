import styled from '@emotion/styled';
import { theme } from '@/shared/styles/theme';

export const HeaderCell = styled.div`
  padding: ${theme.spacing[2]} ${theme.spacing[4]};
  font-size: ${theme.font.size.sm};
  font-weight: ${theme.font.weight.medium};
  color: ${theme.colors.gray[500]};
  text-align: center;
  border-bottom: 1px solid ${theme.colors.gray[200]};
  border-right: 1px solid ${theme.colors.gray[200]};
  &:nth-of-type(7n) {
    border-right: none;
  }
`;
