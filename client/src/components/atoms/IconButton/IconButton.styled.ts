import styled from '@emotion/styled';
import { theme } from '@/shared/styles/theme';

export const StyledIconButton = styled.button<{ $active?: boolean }>`
  padding: ${(p) => (p.$active ? '6px 16px' : '4px')};
  font-size: ${(p) => (p.$active ? theme.font.size.sm : '20px')};
  line-height: 1;
  border: none;
  border-radius: ${theme.radius.md};
  background: ${(p) => (p.$active ? theme.colors.gray[200] : 'transparent')};
  cursor: pointer;
  color: ${(p) => (p.$active ? theme.colors.gray[900] : theme.colors.gray[600])};
  font-weight: ${theme.font.weight.medium};
  &:hover {
    background: ${(p) => (p.$active ? theme.colors.gray[200] : theme.colors.gray[100])};
    color: ${(p) => (p.$active ? theme.colors.gray[900] : theme.colors.gray[800])};
  }
`;
