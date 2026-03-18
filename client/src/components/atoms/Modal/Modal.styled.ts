import styled from '@emotion/styled';
import { theme } from '@/shared/styles/theme';

export const Backdrop = styled.div`
  position: fixed;
  inset: 0;
  background: ${theme.colors.overlay.medium};
  z-index: 65;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: ${theme.spacing[4]};
`;

export const Card = styled.div<{ $maxWidth?: string }>`
  background: ${theme.colors.white};
  border-radius: ${theme.radius.xl};
  box-shadow: ${theme.shadow['2xl']};
  width: 100%;
  max-width: ${(p) => p.$maxWidth ?? 'none'};
  max-height: 85vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;

  @media (max-width: 640px) {
    max-height: calc(100vh - 2 * ${theme.spacing[4]});
    border-radius: ${theme.radius.lg};
  }
`;

export const ScrollBody = styled.div<{ $padding?: string }>`
  flex: 1;
  min-height: 0;
  overflow: auto;
  padding: ${(p) => p.$padding ?? '0'};
`;

