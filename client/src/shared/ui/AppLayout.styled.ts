import styled from '@emotion/styled';
import { theme } from '@/shared/styles/theme';

export const AppRoot = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  min-height: 0;
  background: ${theme.colors.white};
  overflow: hidden;
`;

export const AppHeader = styled.header`
  background: ${theme.colors.orange[500]};
  color: ${theme.colors.white};
  padding: 10px 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: ${theme.spacing[6]};

  .header-left {
    display: flex;
    align-items: center;
    gap: ${theme.spacing[6]};
  }
  .header-link {
    font-size: ${theme.font.size.sm};
    color: ${theme.colors.white};
    background: none;
    border: none;
    cursor: pointer;
    padding: 0;
    text-decoration: none;
  }
  .header-link:hover {
    text-decoration: underline;
  }
  .header-avatars {
    display: flex;
    align-items: center;
    gap: ${theme.spacing[2]};
  }
  .header-avatars-list {
    display: flex;
    align-items: center;
  }
  .header-avatars-list > * {
    margin-left: -8px;
  }
  .header-avatars-list > *:first-of-type {
    margin-left: 0;
  }
  .header-title-wrap {
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .header-calendar-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    color: ${theme.colors.white};
    opacity: 0.95;
  }
  .header-left h1 {
    margin: 0;
    font-size: ${theme.font.size.lg};
    font-weight: ${theme.font.weight.semibold};
    color: ${theme.colors.white};
  }
  .header-right {
    display: flex;
    align-items: center;
    gap: ${theme.spacing[4]};
  }
  .btn-event {
    padding: 6px 12px;
    font-size: ${theme.font.size.sm};
    font-weight: ${theme.font.weight.semibold};
    color: ${theme.colors.white};
    background: ${theme.colors.orange[600]};
    border: none;
    border-radius: ${theme.radius.md};
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    gap: ${theme.spacing[1.5]};
    transition: background 0.15s;
  }
  .btn-event:hover {
    background: ${theme.colors.orange[700]};
  }
  .btn-login {
    padding: 6px 12px;
    font-size: ${theme.font.size.sm};
    font-weight: ${theme.font.weight.medium};
    color: ${theme.colors.white};
    background: rgba(255, 255, 255, 0.2);
    border: none;
    border-radius: ${theme.radius.md};
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    gap: ${theme.spacing[1.5]};
    transition: background 0.15s;
  }
  .btn-login:hover {
    background: rgba(255, 255, 255, 0.3);
  }
  .btn-menu {
    padding: 6px;
    border: none;
    background: transparent;
    color: ${theme.colors.white};
    border-radius: ${theme.radius.md};
    cursor: pointer;
    transition: background 0.15s;
  }
  .btn-menu:hover {
    background: ${theme.colors.orange[600]};
  }
`;

export const Main = styled.main`
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
  width: 100%;
  background: ${theme.colors.white};
`;
