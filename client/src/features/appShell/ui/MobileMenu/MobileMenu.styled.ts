import styled from '@emotion/styled';
import { theme } from '@/shared/styles/theme';
import { Button } from '@/components/atoms/Button';

export const Backdrop = styled.div`
  position: fixed;
  inset: 0;
  background: ${theme.colors.overlay.light};
  z-index: 40;
`;

export const Panel = styled.aside`
  position: fixed;
  top: 0;
  right: 0;
  width: 20rem;
  max-width: 100%;
  height: 100%;
  background: ${theme.colors.white};
  box-shadow: ${theme.shadow['2xl']};
  z-index: 50;
  display: flex;
  flex-direction: column;
`;

export const MenuHeader = styled.div`
  padding: ${theme.spacing[4]};
  border-bottom: 1px solid ${theme.colors.gray[200]};
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const MenuTitle = styled.h2`
  margin: 0;
  font-size: ${theme.font.size.lg};
  font-weight: ${theme.font.weight.semibold};
  color: ${theme.colors.gray[800]};
`;

export const CloseBtn = styled(Button)`
  padding: 0;
  width: 36px;
  height: 36px;
  border: none;
  background: none;
  border-radius: ${theme.radius.sm};
  color: ${theme.colors.gray[600]};
  font-size: 1.25rem;
  line-height: 1;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  &:hover {
    background: ${theme.colors.gray[100]};
  }
`;

export const MenuContent = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: ${theme.spacing[4]};
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing[4]};
`;

export const MenuSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing[3]};
`;

export const MenuSectionLabel = styled.div`
  font-size: ${theme.font.size.xs};
  font-weight: ${theme.font.weight.medium};
  color: ${theme.colors.gray[500]};
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

export const MenuItem = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing[3]};
`;

export const AvatarSection = styled.div`
  display: flex;
  justify-content: center;
  padding: ${theme.spacing[4]} 0;
  border-bottom: 1px solid ${theme.colors.gray[200]};
`;

export const AddEventBtn = styled(Button)`
  background: ${theme.colors.orange[500]};
  color: ${theme.colors.white};
  border: none;
  font-weight: ${theme.font.weight.semibold};
  &:hover {
    background: ${theme.colors.orange[600]};
  }
`;

export const ShareBtn = styled(Button)`
  background: ${theme.colors.orange[500]};
  color: ${theme.colors.white};
  border: none;
  font-weight: ${theme.font.weight.medium};
  &:hover {
    background: ${theme.colors.orange[600]};
  }
`;
