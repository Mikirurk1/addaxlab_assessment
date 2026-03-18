import styled from '@emotion/styled';
import { theme } from '@/shared/styles/theme';

export const Root = styled.div<{ $bare?: boolean }>`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing[2]};
  ${(p) => (p.$bare ? 'gap: 0;' : '')}
`;

export const Label = styled.label`
  font-size: ${theme.font.size.sm};
  font-weight: ${theme.font.weight.medium};
  color: ${theme.colors.gray[700]};
`;

const controlBase = `
  width: 100%;
  padding: 10px 14px;
  font-size: ${theme.font.size.sm};
  border: 1px solid ${theme.colors.gray[300]};
  border-radius: ${theme.radius.md};
  min-width: 220px;
  background: ${theme.colors.white};
  color: inherit;
  box-sizing: border-box;
  &::placeholder {
    color: ${theme.colors.gray[400]};
  }
  &:focus {
    outline: none;
    border-color: ${theme.colors.orange[500]};
    box-shadow: 0 0 0 2px rgba(249, 115, 22, 0.2);
  }
  &[data-variant='header'] {
    border: 1px solid rgba(255,255,255,0.5);
    background: rgba(255,255,255,0.2);
    color: ${theme.colors.white};
    height: 40px;
    min-width: 220px;
  }
  &[data-variant='header']::placeholder {
    color: rgba(255,255,255,0.8);
  }
  &[data-variant='header']:focus {
    border-color: rgba(255,255,255,0.9);
    box-shadow: 0 0 0 2px rgba(255,255,255,0.2);
  }
`;

export const ControlInput = styled.input`
  ${controlBase}
`;

export const ControlTextarea = styled.textarea`
  ${controlBase}
  min-height: 96px;
  resize: vertical;
`;

export const Hint = styled.p`
  margin: 0;
  font-size: 12px;
  color: ${theme.colors.gray[500]};
`;

export const Error = styled.p`
  margin: 0;
  font-size: 12px;
  color: ${theme.colors.red[600]};
`;

