import styled from '@emotion/styled';
import { theme } from '@/shared/styles/theme';

export const FormRoot = styled.form`
  display: flex;
  flex-direction: column;
`;

export const FormSection = styled.div`
  margin-bottom: ${theme.spacing[5]};
`;

export const FormLabel = styled.label`
  display: block;
  font-size: ${theme.font.size.sm};
  font-weight: ${theme.font.weight.medium};
  color: ${theme.colors.gray[700]};
  margin-bottom: ${theme.spacing[2]};
`;

export const FormRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${theme.spacing[3]};

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

export const FormActions = styled.div`
  display: flex;
  gap: ${theme.spacing[3]};
  margin-top: ${theme.spacing[6]};

  @media (max-width: 640px) {
    flex-direction: column-reverse;
  }
`;

