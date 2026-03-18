import styled from '@emotion/styled';
import { theme } from '@/shared/styles/theme';
import { Button } from '@/components/atoms/Button';

export const Wrap = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`;

export const Chip = styled(Button)`
  padding: 6px 10px;
  min-height: 32px;
  font-size: ${theme.font.size.xs};
  border-radius: 9999px;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  border: 1px solid ${theme.colors.gray[200]};
  background: ${theme.colors.white};
  color: ${theme.colors.gray[700]};
  font-weight: ${theme.font.weight.medium};
  transition: background 0.15s, border-color 0.15s, color 0.15s;

  &:hover:not(:disabled) {
    background: ${theme.colors.gray[50]};
    border-color: ${theme.colors.gray[300]};
  }

  &[data-active='true'] {
    background: ${theme.colors.gray[900]};
    color: ${theme.colors.white};
    border-color: ${theme.colors.gray[900]};
    &:hover:not(:disabled) {
      background: ${theme.colors.gray[800]};
    }
  }

  &:focus-visible {
    outline: none;
    box-shadow: 0 0 0 3px rgba(249, 115, 22, 0.25);
  }
`;

export const Dot = styled.span<{ $color: string }>`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: ${(p) => p.$color};
  box-shadow: inset 0 0 0 1px rgba(17, 24, 39, 0.12);
  flex-shrink: 0;
`;

