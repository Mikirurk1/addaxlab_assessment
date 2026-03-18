import styled from '@emotion/styled';
import { theme } from '@/shared/styles/theme';

export const Backdrop = styled.div`
  position: fixed;
  inset: 0;
  background: ${theme.colors.overlay.medium};
  z-index: 80;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: ${theme.spacing[4]};
`;

export const Box = styled.div`
  background: ${theme.colors.white};
  border-radius: ${theme.radius.xl};
  box-shadow: ${theme.shadow['2xl']};
  width: 100%;
  max-width: 26rem;
  padding: ${theme.spacing[5]};
`;

export const Title = styled.h3`
  margin: 0 0 ${theme.spacing[2]} 0;
  font-size: ${theme.font.size.lg};
  font-weight: ${theme.font.weight.semibold};
  color: ${theme.colors.gray[800]};
`;

export const Text = styled.p`
  margin: 0 0 ${theme.spacing[4]} 0;
  font-size: ${theme.font.size.sm};
  color: ${theme.colors.gray[600]};
  line-height: 1.4;
`;

export const Actions = styled.div`
  display: flex;
  gap: ${theme.spacing[3]};
`;

