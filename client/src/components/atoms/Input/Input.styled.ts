import styled from '@emotion/styled';
import { theme } from '@/shared/styles/theme';

export const StyledInput = styled.input<{ $variant?: 'default' | 'header' }>`
  padding: 10px 14px;
  font-size: ${theme.font.size.sm};
  border: 1px solid
    ${(p) => (p.$variant === 'header' ? 'rgba(255,255,255,0.5)' : theme.colors.gray[300])};
  border-radius: ${theme.radius.md};
  min-width: 220px;
  background: ${(p) => (p.$variant === 'header' ? 'rgba(255,255,255,0.2)' : theme.colors.white)};
  color: ${(p) => (p.$variant === 'header' ? theme.colors.white : 'inherit')};
  &::placeholder {
    color: ${(p) => (p.$variant === 'header' ? 'rgba(255,255,255,0.8)' : theme.colors.gray[400])};
  }
  &:focus {
    outline: none;
    border-color: ${(p) =>
      p.$variant === 'header' ? 'rgba(255,255,255,0.9)' : theme.colors.orange[500]};
    box-shadow: 0 0 0 2px
      ${(p) =>
        p.$variant === 'header' ? 'rgba(255,255,255,0.2)' : 'rgba(249, 115, 22, 0.2)'};
  }
`;
