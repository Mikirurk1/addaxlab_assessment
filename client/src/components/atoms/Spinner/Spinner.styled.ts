import styled from '@emotion/styled';
import { theme } from '@/shared/styles/theme';

export const StyledSpinner = styled.div`
  width: 32px;
  height: 32px;
  border: 3px solid ${theme.colors.gray[200]};
  border-top-color: ${theme.colors.orange[500]};
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;
