import styled from '@emotion/styled';
import { theme } from '@/shared/styles/theme';
import { Button } from '@/components/atoms/Button';

export const Nav = styled.nav`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${theme.spacing[4]};
  padding: ${theme.spacing[4]} ${theme.spacing[6]};
  border-bottom: 1px solid ${theme.colors.gray[200]};
  flex-wrap: wrap;

  @media (max-width: 768px) {
    flex-direction: row;
    flex-wrap: wrap;
    padding: ${theme.spacing[3]} ${theme.spacing[3]};
    gap: ${theme.spacing[3]};
  }
`;

export const NavLeft = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  gap: ${theme.spacing[2]};
  min-width: 0;

  @media (max-width: 768px) {
    flex: 0 0 auto;
    justify-content: flex-start;
  }
`;

export const NavCenter = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 0;

  @media (max-width: 768px) {
    flex: 0 0 auto;
    order: -1;
    width: 100%;
  }
`;

export const MonthTitle = styled.h2`
  margin: 0;
  font-size: ${theme.font.size.xl};
  font-weight: ${theme.font.weight.semibold};
  color: ${theme.colors.gray[800]};
  text-align: center;

  @media (max-width: 768px) {
    font-size: ${theme.font.size.base};
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    max-width: 100%;
  }
`;

export const NavRight = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: ${theme.spacing[2]};
  min-width: 0;

  @media (max-width: 768px) {
    flex: 0 0 auto;
    justify-content: flex-end;
  }
`;

export const ViewToggle = styled.div`
  display: inline-flex;
  gap: 0;
  border-radius: ${theme.radius.md};
  overflow: hidden;
  background: transparent;
  & button {
    flex: 1;
    min-width: 96px;
    border-radius: 0;
    border: none;
    font-size: ${theme.font.size.sm};
    padding: 8px 16px;
    background: rgba(249, 115, 22, 0.14);
    color: ${theme.colors.gray[900]};
    box-shadow: none;
    cursor: pointer;
    transition: background 0.15s, color 0.15s;
  }
  & button[data-active='true'] {
    background: ${theme.colors.orange[600]};
    color: ${theme.colors.white};
    font-weight: ${theme.font.weight.semibold};
    box-shadow: none;
    cursor: default;
    pointer-events: none;
  }
  & button:hover {
    background: rgba(249, 115, 22, 0.22);
    color: ${theme.colors.gray[900]};
  }
  & button[data-active='true']:hover {
    background: ${theme.colors.orange[600]};
  }

  @media (max-width: 768px) {
    & button {
      min-width: 56px;
      padding: 6px 10px;
      font-size: ${theme.font.size.xs};
    }
  }
`;

export const NavSquareButton = styled(Button)`
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

  @media (max-width: 768px) {
    width: 32px;
    height: 32px;
    font-size: 18px;
  }
`;

export const TodayButton = styled(Button)`
  height: 36px;
  padding: 6px 12px;
  border: none;
  border-radius: ${theme.radius.md};
  background: ${theme.colors.orange[600]};
  color: ${theme.colors.white};
  font-weight: ${theme.font.weight.semibold};
  box-shadow: none;
  transition: background 0.15s, color 0.15s;
  &:hover:not(:disabled) {
    background: ${theme.colors.orange[700]};
  }
  &:focus-visible {
    outline: none;
    box-shadow: 0 0 0 3px rgba(249, 115, 22, 0.30);
  }

  @media (max-width: 768px) {
    height: 32px;
    padding: 4px 10px;
    font-size: ${theme.font.size.sm};
  }
`;
