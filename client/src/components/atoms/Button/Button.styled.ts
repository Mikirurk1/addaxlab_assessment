import styled from '@emotion/styled';
import { theme } from '@/shared/styles/theme';

export const StyledButton = styled.button<{ $variant?: 'default' | 'ghost' | 'dashed' }>`
  padding: ${theme.spacing[1.5]} ${theme.spacing[3]};
  font-size: ${theme.font.size.sm};
  border-radius: ${theme.radius.md};
  cursor: pointer;
  font-weight: ${theme.font.weight.medium};
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: ${theme.spacing[2]};
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
  &:hover {
    background: ${(p) =>
      p.$variant === 'ghost' ? theme.colors.gray[100] : theme.colors.gray[50]};
  }
  &:disabled {
    cursor: not-allowed;
    opacity: 0.6;
  }
`;

export const StartIconWrap = styled.span`
  display: inherit;
  line-height: 0;
`;

export const EndIconWrap = styled.span`
  display: inherit;
  line-height: 0;
`;

export const TextWrap = styled.span`
  display: inline-flex;
  min-width: 0;
`;

export const LoadingWrap = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  line-height: 0;

  /* Spinner атом може бути трохи більшим за текст кнопки. */
  & > * {
    transform: scale(0.75);
    transform-origin: center;
  }
`;

export const Loader = styled.span`
  width: 16px;
  height: 16px;
  border-radius: 9999px;
  border: 2px solid rgba(0, 0, 0, 0.15);
  border-top-color: ${theme.colors.orange[500]};
  animation: addaxSpin 0.8s linear infinite;

  @keyframes addaxSpin {
    to {
      transform: rotate(360deg);
    }
  }
`;
