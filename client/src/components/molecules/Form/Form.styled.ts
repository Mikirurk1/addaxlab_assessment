import styled from '@emotion/styled';
import { theme } from '@/shared/styles/theme';

export const SubLabel = styled.div`
  font-size: 11px;
  color: ${theme.colors.gray[500]};
  margin-bottom: ${theme.spacing[1.5]};
`;

export const Select = styled.select`
  width: 100%;
  padding: ${theme.spacing[2]} ${theme.spacing[3]};
  border: 1px solid ${theme.colors.gray[300]};
  border-radius: ${theme.radius.lg};
  font-size: ${theme.font.size.sm};
  background: ${theme.colors.white};
  color: ${theme.colors.gray[800]};
  box-sizing: border-box;
  &:focus {
    outline: none;
    border-color: ${theme.colors.orange[500]};
    box-shadow: 0 0 0 2px rgba(249, 115, 22, 0.2);
  }
`;

export const HelperText = styled.p`
  margin: ${theme.spacing[2.5]} 0 0 0;
  color: ${theme.colors.gray[500]};
  font-size: 12px;
`;

export const ErrorText = styled.p`
  margin: ${theme.spacing[2.5]} 0 0 0;
  color: ${theme.colors.red[600]};
  font-size: 12px;
`;

export const PillsWrap = styled.div`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin-top: 10px;
`;

export const TogglePill = styled.label<{ $active: boolean }>`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 10px;
  border-radius: 9999px;
  border: 1px solid ${theme.colors.gray[200]};
  background: ${(p) => (p.$active ? theme.colors.gray[900] : theme.colors.gray[100])};
  color: ${(p) => (p.$active ? theme.colors.white : theme.colors.gray[700])};
  cursor: pointer;
  font-size: 12px;
  font-weight: ${theme.font.weight.semibold};
`;

export const HiddenCheckbox = styled.input`
  display: none;
`;

