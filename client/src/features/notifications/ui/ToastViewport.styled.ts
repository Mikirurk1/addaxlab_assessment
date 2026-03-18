import styled from "@emotion/styled";
import { theme } from "@/shared/styles/theme";
import { Button } from "@/components/atoms/Button";

const kindColors = (kind: "success" | "info" | "warning" | "error") => {
  switch (kind) {
    case "success":
      return {
        accent: "#16a34a",
        border: "#86efac",
        bg: "#f0fdf4",
        iconBg: "#dcfce7",
        iconFg: "#166534",
      };
    case "warning":
      return {
        accent: "#f59e0b",
        border: "#fde68a",
        bg: "#fffbeb",
        iconBg: "#fef3c7",
        iconFg: "#92400e",
      };
    case "error":
      return {
        accent: theme.colors.red[600],
        border: "#fecaca",
        bg: "#fef2f2",
        iconBg: "#fee2e2",
        iconFg: "#991b1b",
      };
    default:
      return {
        accent: "#2563eb",
        border: "#bfdbfe",
        bg: "#eff6ff",
        iconBg: "#dbeafe",
        iconFg: "#1e3a8a",
      };
  }
};

export const Viewport = styled.div`
  position: fixed;
  top: ${theme.spacing[4]};
  right: ${theme.spacing[4]};
  z-index: 1001;
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing[2]};
  width: min(360px, calc(100vw - 2 * ${theme.spacing[4]}));
  pointer-events: none;

  @media (max-width: 640px) {
    top: ${theme.spacing[3]};
    right: ${theme.spacing[3]};
    width: min(360px, calc(100vw - 2 * ${theme.spacing[3]}));
  }
`;

export const ToastCard = styled.div<{
  $kind: "success" | "info" | "warning" | "error";
}>`
  pointer-events: auto;
  background: ${(p) => kindColors(p.$kind).bg};
  border: 1px solid ${(p) => kindColors(p.$kind).border};
  border-radius: ${theme.radius.lg};
  box-shadow: ${theme.shadow.md};
  padding: ${theme.spacing[3]} ${theme.spacing[3]};
  display: flex;
  gap: ${theme.spacing[3]};
  align-items: flex-start;
  animation: toast-in 160ms ease-out;
  position: relative;
  overflow: hidden;

  &::before {
    content: "";
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    width: 4px;
    background: ${(p) => kindColors(p.$kind).accent};
  }

  @keyframes toast-in {
    from {
      opacity: 0;
      transform: translateY(-6px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  /* subtle highlight layer */
  &::after {
    content: "";
    position: absolute;
    inset: 0;
    background: linear-gradient(
      180deg,
      rgba(255, 255, 255, 0.55) 0%,
      rgba(255, 255, 255, 0) 70%
    );
    pointer-events: none;
  }
`;

export const IconWrap = styled.div<{
  $kind: "success" | "info" | "warning" | "error";
}>`
  width: 28px;
  height: 28px;
  border-radius: ${theme.radius.md};
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: ${(p) => kindColors(p.$kind).iconBg};
  color: ${(p) => kindColors(p.$kind).iconFg};
  flex-shrink: 0;
`;

export const Content = styled.div`
  flex: 1;
  min-width: 0;
`;

export const TitleRow = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: ${theme.spacing[2]};
`;

export const Title = styled.div`
  font-size: ${theme.font.size.sm};
  font-weight: ${theme.font.weight.semibold};
  color: ${theme.colors.gray[900]};
  line-height: 1.25;
  letter-spacing: -0.01em;
`;

export const Description = styled.div`
  margin-top: 2px;
  font-size: ${theme.font.size.xs};
  color: ${theme.colors.gray[600]};
  line-height: 1.35;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
`;

export const CloseBtn = styled(Button)`
  width: 28px;
  height: 28px;
  border: none;
  background: transparent;
  border-radius: ${theme.radius.md};
  color: ${theme.colors.gray[600]};
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  &:hover {
    background: ${theme.colors.gray[100]};
    color: ${theme.colors.gray[800]};
  }
`;
