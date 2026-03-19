import styled from "@emotion/styled";
import { theme } from "@/shared/styles/theme";

export const AppRoot = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  min-height: 0;
  background: ${theme.colors.white};
  overflow: hidden;

  /* Global scrollbar styling (WebKit + Firefox) */
  * {
    scrollbar-width: thin;
    scrollbar-color: ${theme.colors.gray[300]} transparent;
  }
  *::-webkit-scrollbar {
    width: 10px;
    height: 10px;
  }
  *::-webkit-scrollbar-track {
    background: transparent;
  }
  *::-webkit-scrollbar-thumb {
    background: ${theme.colors.gray[300]};
    border-radius: 9999px;
    border: 3px solid transparent;
    background-clip: content-box;
  }
  *::-webkit-scrollbar-thumb:hover {
    background: ${theme.colors.gray[400]};
    background-clip: content-box;
  }
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
  --header-control-h: 40px;

  .header-left {
    display: flex;
    align-items: center;
    gap: ${theme.spacing[6]};
  }
  .header-link {
    font-size: ${theme.font.size.sm};
    color: ${theme.colors.white};
    height: var(--header-control-h);
    padding: 0 12px;
    border-radius: ${theme.radius.md};
    background: rgba(255, 255, 255, 0.14);
    border: 1px solid rgba(255, 255, 255, 0.28);
    display: inline-flex;
    align-items: center;
    justify-content: center;
    text-decoration: none;
    transition:
      background 0.15s,
      border-color 0.15s;
  }
  .header-link:hover {
    background: rgba(255, 255, 255, 0.22);
    border-color: rgba(255, 255, 255, 0.38);
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
  .header-avatars-more {
    font-size: 14px;
    font-weight: ${theme.font.weight.medium};
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
  .btn-avatar {
    display: inline-flex;
    align-items: center;
  }
  .header-right > * {
    flex-shrink: 0;
  }
  .header-right input {
    height: var(--header-control-h);
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
    min-height: var(--header-control-h);
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
    min-height: var(--header-control-h);
  }
  .btn-login:hover {
    background: rgba(255, 255, 255, 0.3);
  }
  .btn-filter,
  .btn-burger {
    padding: 0;
    width: var(--header-control-h);
    height: var(--header-control-h);
    border: none;
    background: transparent;
    color: ${theme.colors.white};
    border-radius: ${theme.radius.md};
    cursor: pointer;
    transition: background 0.15s;
    display: inline-flex;
    align-items: center;
    justify-content: center;
  }
  .btn-filter:hover,
  .btn-burger:hover {
    background: ${theme.colors.orange[600]};
  }

  .header-mobile-only {
    display: none;
  }

  @media (max-width: 768px) {
    padding: 10px 12px;
    gap: ${theme.spacing[3]};
    --header-control-h: 36px;
    flex-wrap: nowrap;

    .header-left {
      flex: 0 0 auto;
      min-width: 0;
      gap: ${theme.spacing[2]};
    }
    .header-left h1 {
      font-size: ${theme.font.size.base};
    }
    .header-calendar-icon img {
      width: 18px;
      height: 18px;
    }
    .header-desktop-only {
      display: none !important;
    }
    .header-mobile-only {
      display: inline-flex !important;
    }
    .header-right {
      flex: 1 1 auto;
      justify-content: flex-end;
      flex-wrap: nowrap;
      gap: ${theme.spacing[2]};
      min-width: 0;
    }
    .header-avatars {
      flex: 1 1 auto;
      min-width: 0;
      overflow: hidden;
    }
    .header-avatars-list {
      flex-shrink: 1;
    }
    .header-avatars-more {
      flex-shrink: 0;
      font-size: 12px;
    }
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

export const Centered = styled.div`
  display: flex;
  justify-content: center;
  padding: 48px;
`;
