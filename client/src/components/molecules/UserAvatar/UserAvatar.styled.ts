import styled from "@emotion/styled";
import { theme } from "@/shared/styles/theme";

export const AvatarWrap = styled.div<{ $size: number }>`
  position: relative;
  width: ${(p) => p.$size}px;
  height: ${(p) => p.$size}px;
  flex-shrink: 0;
`;

const DROPDOWN_MIN_WIDTH = 200;
const DROPDOWN_EDGE_GAP = 8;
const NICKNAME_CONTROL_H = 40;

export const Dropdown = styled.div<{
  $left?: number;
  $top?: number;
  $maxHeight?: number;
  $rightEdge?: number;
}>`
  box-sizing: border-box;
  position: ${(p) =>
    p.$left !== undefined && p.$top !== undefined ? "fixed" : "absolute"};
  ${(p) =>
    p.$left !== undefined && p.$top !== undefined && p.$rightEdge !== undefined
      ? `
    left: ${p.$left}px;
    right: ${p.$rightEdge}px;
    width: auto;
    top: ${p.$top}px;
    transform: none;
    max-height: ${p.$maxHeight ?? 320}px;
    overflow-y: auto;
    overflow-x: hidden;
  `
      : `
  left: 50%;
  transform: translateX(-50%);
  top: 100%;
  margin-top: ${theme.spacing[2]};
  max-width: calc(100vw - ${DROPDOWN_EDGE_GAP * 2}px);
  `}
  min-width: ${DROPDOWN_MIN_WIDTH}px;
  padding: ${theme.spacing[3]};
  background: ${theme.colors.white};
  border-radius: ${theme.radius.lg};
  box-shadow: 0 4px 12px ${theme.colors.overlay.medium};
  border: 1px solid ${theme.colors.gray[200]};
  z-index: 1000;
  font-size: ${theme.font.size.sm};
`;

export const DropdownName = styled.div`
  font-weight: ${theme.font.weight.semibold};
  color: ${theme.colors.gray[800]};
  margin-bottom: ${theme.spacing[1]};
`;

export const DropdownEmail = styled.div`
  color: ${theme.colors.gray[600]};
  margin-bottom: ${theme.spacing[3]};
  word-break: break-all;
`;

export const DropdownActions = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing[1]};
  margin-bottom: ${theme.spacing[2]};
  padding-top: ${theme.spacing[2]};
  border-top: 1px solid ${theme.colors.gray[200]};
`;

export const DropdownLogoutRow = styled.div`
  padding-top: ${theme.spacing[2]};
  margin-top: ${theme.spacing[2]};
  border-top: 1px solid ${theme.colors.gray[200]};
`;

export const LogoutBtn = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: ${theme.spacing[2]} ${theme.spacing[3]};
  font-size: ${theme.font.size.sm};
  font-weight: ${theme.font.weight.medium};
  color: ${theme.colors.gray[700]};
  background: ${theme.colors.white};
  border: 1px solid ${theme.colors.gray[300]};
  border-radius: ${theme.radius.md};
  cursor: pointer;
  transition:
    background 0.15s,
    border-color 0.15s;
  &:hover {
    background: rgba(220, 38, 38, 0.08);
    border-color: ${theme.colors.red[600]};
    color: ${theme.colors.red[600]};
  }
`;

export const DropdownBtn = styled.button`
  padding: ${theme.spacing[2]} ${theme.spacing[2]};
  font-size: ${theme.font.size.sm};
  text-align: left;
  border: none;
  border-radius: ${theme.radius.md};
  background: transparent;
  color: ${theme.colors.gray[700]};
  cursor: pointer;
  &:hover {
    background: ${theme.colors.gray[100]};
  }
`;

export const DropdownNicknameRow = styled.div`
  padding-top: ${theme.spacing[2]};
  border-top: 1px solid ${theme.colors.gray[200]};
`;

export const NicknameInputRow = styled.div`
  display: flex;
  gap: ${theme.spacing[2]};
  align-items: stretch;
  margin-top: ${theme.spacing[1]};
  min-width: 0;
`;

export const NicknameSaveBtn = styled.button`
  height: ${NICKNAME_CONTROL_H}px;
  padding: 0 ${theme.spacing[3]};
  font-size: ${theme.font.size.sm};
  font-weight: ${theme.font.weight.medium};
  border: none;
  border-radius: ${theme.radius.md};
  background: ${theme.colors.orange[500]};
  color: ${theme.colors.white};
  cursor: pointer;
  box-sizing: border-box;
  transition: background 0.15s;
  &:hover:not(:disabled) {
    background: ${theme.colors.orange[600]};
  }
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

export const NicknameFieldWrap = styled.div`
  flex: 1;
  min-width: 0;
`;

export const nicknameFieldClassNames = {
  root: 'ua-nickname-root',
  label: 'ua-nickname-label',
  input: 'ua-nickname-input',
  error: 'ua-nickname-error',
} as const;

export const NicknameFieldGlobalStyles = styled.div`
  .ua-nickname-root {
    min-width: 0;
  }
  .ua-nickname-input {
    min-width: 0;
    height: ${NICKNAME_CONTROL_H}px;
    color: ${theme.colors.gray[800]};
    background: ${theme.colors.white};
  }
  .ua-nickname-input::placeholder {
    color: ${theme.colors.gray[400]};
  }
  .ua-nickname-error {
    color: ${theme.colors.red[600]};
  }
`;

export const LogoutIconWrap = styled.span`
  display: inline-flex;
  align-items: center;
  margin-right: ${theme.spacing[2]};
  vertical-align: middle;
`;
