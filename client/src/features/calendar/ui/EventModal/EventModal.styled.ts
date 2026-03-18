import styled from '@emotion/styled';
import { theme } from '@/shared/styles/theme';
import { Button } from '@/components/atoms/Button';
import { Field } from '@/components/atoms/Field';

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

export const HeaderActions = styled.div`
  display: inline-flex;
  align-items: center;
  gap: ${theme.spacing[2]};
`;

export const CloseBtn = styled(Button)`
  width: 36px;
  height: 36px;
  padding: 0;
  border: none;
  border-radius: ${theme.radius.md};
  background: transparent;
  color: ${theme.colors.gray[600]};
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  line-height: 1;

  &:hover:not(:disabled) {
    background: ${theme.colors.gray[100]};
    color: ${theme.colors.gray[800]};
  }
`;

export const HeaderIconAction = styled(Button)<{ $tone?: 'default' | 'danger' }>`
  width: 34px;
  height: 34px;
  padding: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: ${theme.radius.lg};
  background: transparent;
  border: 1px solid ${(p) => (p.$tone === 'danger' ? theme.colors.red[600] : theme.colors.gray[300])};
  color: ${(p) => (p.$tone === 'danger' ? theme.colors.red[600] : theme.colors.gray[700])};

  &:hover:not(:disabled) {
    background: ${(p) =>
      p.$tone === 'danger' ? 'rgba(220, 38, 38, 0.08)' : theme.colors.gray[100]};
  }
`;

export const BtnDanger = styled(Button)`
  flex: 1;
  padding: ${theme.spacing[2]} ${theme.spacing[4]};
  font-size: ${theme.font.size.sm};
  border: 1px solid ${theme.colors.red[600]};
  border-radius: ${theme.radius.lg};
  background: ${theme.colors.red[600]};
  color: ${theme.colors.white};
  font-weight: ${theme.font.weight.medium};
  &:hover:not(:disabled) {
    background: ${theme.colors.red[600]};
    filter: brightness(0.95);
  }
  &:disabled {
    opacity: 0.5;
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

export const Input = styled(Field)`
  width: 100%;
  min-width: 0;
`;

export const Row = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${theme.spacing[3]};

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

export const ColorGrid = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${theme.spacing[2]};
`;

export const CountryGrid = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${theme.spacing[2]};
`;

export const CountryChip = styled(Button)`
  padding: ${theme.spacing[2]} ${theme.spacing[4]};
  font-size: ${theme.font.size.sm};
  border-radius: ${theme.radius.lg};
  border: none;
  display: inline-flex;
  align-items: center;
  gap: ${theme.spacing[2]};
  background: ${theme.colors.gray[100]};
  color: ${theme.colors.gray[700]};
  font-weight: ${theme.font.weight.medium};
  &:hover {
    background: ${theme.colors.gray[200]};
  }
  &[data-active='true'] {
    background: ${theme.colors.gray[800]};
    color: ${theme.colors.white};
    &:hover {
      background: ${theme.colors.gray[700]};
    }
  }
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

export const CreatedByRow = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing[2]};
  margin-top: ${theme.spacing[4]};
  margin-bottom: ${theme.spacing[4]};
  font-size: ${theme.font.size.sm};
  color: ${theme.colors.gray[600]};
`;

export const Actions = styled.div`
  display: flex;
  gap: ${theme.spacing[3]};
  margin-top: ${theme.spacing[2]};

  @media (max-width: 640px) {
    flex-direction: column-reverse;
  }
`;

export const BtnSecondary = styled(Button)`
  flex: 1;
  padding: ${theme.spacing[2]} ${theme.spacing[4]};
  font-size: ${theme.font.size.sm};
  border: 1px solid ${theme.colors.gray[300]};
  border-radius: ${theme.radius.lg};
  background: ${theme.colors.white};
  color: ${theme.colors.gray[700]};
  font-weight: ${theme.font.weight.medium};
  &:hover {
    background: ${theme.colors.gray[50]};
  }
`;

export const BtnPrimary = styled(Button)`
  flex: 1;
  padding: ${theme.spacing[2]} ${theme.spacing[4]};
  font-size: ${theme.font.size.sm};
  border: none;
  border-radius: ${theme.radius.lg};
  background: ${theme.colors.orange[500]};
  color: ${theme.colors.white};
  font-weight: ${theme.font.weight.medium};
  &:hover:not(:disabled) {
    background: ${theme.colors.orange[600]};
  }
  &:disabled {
    opacity: 0.5;
  }
`;

