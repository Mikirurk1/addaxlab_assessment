import styled from '@emotion/styled';
import { theme } from '@/shared/styles/theme';

export const StyledButton = styled.button<{ $variant?: 'default' | 'ghost' | 'dashed' }>`
  padding: ${theme.spacing[1.5]} ${theme.spacing[3]};
  font-size: ${theme.font.size.sm};
  border-radius: ${theme.radius.md};
  cursor: pointer;
  font-weight: ${theme.font.weight.medium};
  border: 1px solid
    ${(p) =>
      p.$variant === 'dashed'
        ? theme.colors.gray[400]
        : p.$variant === 'ghost'
          ? 'transparent'
          : theme.colors.gray[300]};
  background: ${(p) =>
    p.$variant === 'ghost'
      ? 'transparent'
      : p.$variant === 'dashed'
        ? 'rgba(255,255,255,0.8)'
        : theme.colors.white};
  color: ${theme.colors.gray[600]};
  text-align: left;
  &:hover {
    background: ${(p) =>
      p.$variant === 'ghost' ? theme.colors.gray[100] : theme.colors.gray[50]};
  }
`;
