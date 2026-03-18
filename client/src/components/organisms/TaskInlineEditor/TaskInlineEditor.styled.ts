import styled from '@emotion/styled';
import { theme } from '@/shared/styles/theme';
import { Field } from '@/components/atoms/Field';

export const InlineInput = styled(Field)`
  width: 100%;
  padding: ${theme.spacing[1.5]} ${theme.spacing[2]};
  font-size: ${theme.font.size.sm};
  outline: none;
  box-sizing: border-box;
`;
