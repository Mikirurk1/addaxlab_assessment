import styled from '@emotion/styled';
import { theme } from '@/shared/styles/theme';

export const Nav = styled.nav`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${theme.spacing[4]};
  padding: ${theme.spacing[4]} ${theme.spacing[6]};
  border-bottom: 1px solid ${theme.colors.gray[200]};
  flex-wrap: wrap;
`;

export const NavLeft = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  gap: ${theme.spacing[2]};
  min-width: 0;
`;

export const NavCenter = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 0;
`;

export const NavRight = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: ${theme.spacing[2]};
  min-width: 0;
`;

export const MonthTitle = styled.h2`
  margin: 0;
  font-size: ${theme.font.size.xl};
  font-weight: ${theme.font.weight.semibold};
  color: ${theme.colors.gray[800]};
`;

export const ViewToggle = styled.div`
  display: inline-flex;
  gap: 0;
  border: 1px solid ${theme.colors.gray[300]};
  border-radius: ${theme.radius.md};
  overflow: hidden;
  background: ${theme.colors.gray[100]};
  & button {
    border-radius: 0;
    border: none;
    font-size: ${theme.font.size.sm};
    padding: 8px 16px;
    background: transparent;
    color: ${theme.colors.gray[600]};
  }
  & button[data-active='true'] {
    background: ${theme.colors.white};
    color: ${theme.colors.gray[900]};
    box-shadow: ${theme.shadow.sm};
  }
  & button:hover {
    color: ${theme.colors.gray[800]};
  }
  & button[data-active='true']:hover {
    background: ${theme.colors.white};
  }
`;
