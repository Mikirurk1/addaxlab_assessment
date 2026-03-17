import styled from '@emotion/styled';
import { theme } from '@/shared/styles/theme';

export const Backdrop = styled.div`
  position: fixed;
  inset: 0;
  background: ${theme.colors.overlay.medium};
  z-index: 50;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const ModalBox = styled.div`
  background: ${theme.colors.white};
  border-radius: ${theme.radius.xl};
  box-shadow: ${theme.shadow['2xl']};
  width: 100%;
  max-width: 32rem;
  max-height: 90vh;
  overflow-y: auto;
  padding: ${theme.spacing[6]};
`;

export const ModalHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: ${theme.spacing[6]};
`;

export const ModalTitle = styled.h2`
  margin: 0;
  font-size: ${theme.font.size.xl};
  font-weight: ${theme.font.weight.semibold};
  color: ${theme.colors.gray[800]};
`;

export const CloseBtn = styled.button`
  padding: ${theme.spacing[1]};
  border: none;
  background: none;
  cursor: pointer;
  border-radius: ${theme.radius.md};
  color: ${theme.colors.gray[600]};
  font-size: 1.25rem;
  line-height: 1;
  &:hover {
    background: ${theme.colors.gray[100]};
  }
`;

export const FormGroup = styled.div`
  margin-bottom: ${theme.spacing[5]};
`;

export const Label = styled.label`
  display: block;
  font-size: ${theme.font.size.sm};
  font-weight: ${theme.font.weight.medium};
  color: ${theme.colors.gray[700]};
  margin-bottom: ${theme.spacing[2]};
`;

export const Input = styled.input`
  width: 100%;
  padding: ${theme.spacing[2]} ${theme.spacing[3]};
  font-size: ${theme.font.size.sm};
  border: 1px solid ${theme.colors.gray[300]};
  border-radius: ${theme.radius.lg};
  box-sizing: border-box;
  &:focus {
    outline: none;
    border-color: ${theme.colors.orange[500]};
    box-shadow: 0 0 0 2px rgba(249, 115, 22, 0.2);
  }
`;

export const Row = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${theme.spacing[3]};
`;

export const ColorGrid = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${theme.spacing[2]};
`;

export const ColorChip = styled.button<{ $active: boolean }>`
  padding: ${theme.spacing[2]} ${theme.spacing[4]};
  font-size: ${theme.font.size.sm};
  border-radius: ${theme.radius.lg};
  border: none;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: ${theme.spacing[2]};
  background: ${(p) => (p.$active ? theme.colors.gray[800] : theme.colors.gray[100])};
  color: ${(p) => (p.$active ? theme.colors.white : theme.colors.gray[700])};
  font-weight: ${theme.font.weight.medium};
  &:hover {
    background: ${(p) => (p.$active ? theme.colors.gray[700] : theme.colors.gray[200])};
  }
`;

export const ColorDot = styled.span<{ $bg: string }>`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: ${(p) => p.$bg};
`;

export const CheckboxBlock = styled.div`
  border: 1px solid ${theme.colors.gray[200]};
  border-radius: ${theme.radius.lg};
  padding: ${theme.spacing[4]};
  background: ${theme.colors.gray[50]};
`;

export const CheckboxLabel = styled.label`
  display: flex;
  align-items: flex-start;
  gap: ${theme.spacing[3]};
  cursor: pointer;
`;

export const Actions = styled.div`
  display: flex;
  gap: ${theme.spacing[3]};
  margin-top: ${theme.spacing[6]};
`;

export const BtnSecondary = styled.button`
  flex: 1;
  padding: ${theme.spacing[2]} ${theme.spacing[4]};
  font-size: ${theme.font.size.sm};
  border: 1px solid ${theme.colors.gray[300]};
  border-radius: ${theme.radius.lg};
  background: ${theme.colors.white};
  color: ${theme.colors.gray[700]};
  cursor: pointer;
  font-weight: ${theme.font.weight.medium};
  &:hover {
    background: ${theme.colors.gray[50]};
  }
`;

export const BtnPrimary = styled.button`
  flex: 1;
  padding: ${theme.spacing[2]} ${theme.spacing[4]};
  font-size: ${theme.font.size.sm};
  border: none;
  border-radius: ${theme.radius.lg};
  background: ${theme.colors.orange[500]};
  color: ${theme.colors.white};
  cursor: pointer;
  font-weight: ${theme.font.weight.medium};
  &:hover:not(:disabled) {
    background: ${theme.colors.orange[600]};
  }
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;
