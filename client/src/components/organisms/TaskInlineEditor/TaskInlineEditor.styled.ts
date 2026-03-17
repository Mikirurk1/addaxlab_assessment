import styled from '@emotion/styled';
import { theme } from '@/shared/styles/theme';

export const InlineInput = styled.input`
  width: 100%;
  padding: ${theme.spacing[1.5]} ${theme.spacing[2]};
  font-size: ${theme.font.size.sm};
  border: 1px solid ${theme.colors.gray[300]};
  border-radius: ${theme.radius.md};
  outline: none;
  box-sizing: border-box;
  &:focus {
    border-color: ${theme.colors.orange[500]};
    box-shadow: 0 0 0 2px rgba(249, 115, 22, 0.2);
  }
`;
