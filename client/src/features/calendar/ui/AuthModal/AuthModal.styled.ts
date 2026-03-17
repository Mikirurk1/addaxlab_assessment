import styled from '@emotion/styled';
import { theme } from '@/shared/styles/theme';

export const Backdrop = styled.div`
  position: fixed;
  inset: 0;
  background: ${theme.colors.overlay.dark};
  z-index: 50;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const ModalBox = styled.div`
  background: ${theme.colors.white};
  border-radius: ${theme.radius.xl};
  box-shadow: ${theme.shadow['2xl']};
  width: 100%;
  max-width: 28rem;
  overflow: hidden;
`;

export const ModalHeader = styled.div`
  background: linear-gradient(90deg, ${theme.colors.orange[500]} 0%, ${theme.colors.orange[600]} 100%);
  color: ${theme.colors.white};
  padding: ${theme.spacing[5]} ${theme.spacing[6]};
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
`;

export const HeaderText = styled.div``;

export const ModalTitle = styled.h2`
  margin: 0;
  font-size: ${theme.font.size['2xl']};
  font-weight: ${theme.font.weight.bold};
`;

export const ModalSubtitle = styled.p`
  margin: ${theme.spacing[1]} 0 0 0;
  font-size: ${theme.font.size.sm};
  color: rgba(255, 255, 255, 0.9);
`;

export const CloseBtn = styled.button`
  padding: ${theme.spacing[1.5]};
  border: none;
  background: rgba(255, 255, 255, 0.2);
  color: ${theme.colors.white};
  border-radius: ${theme.radius.lg};
  cursor: pointer;
  font-size: 1.25rem;
  line-height: 1;
  &:hover {
    background: rgba(255, 255, 255, 0.3);
  }
`;

export const FormBody = styled.div`
  padding: ${theme.spacing[6]};
`;

export const FormGroup = styled.div`
  margin-bottom: ${theme.spacing[4]};
`;

export const Label = styled.label`
  display: block;
  font-size: ${theme.font.size.sm};
  font-weight: ${theme.font.weight.medium};
  color: ${theme.colors.gray[700]};
  margin-bottom: ${theme.spacing[2]};
`;

export const Input = styled.input`
  width: 100%;
  padding: 10px 12px 10px 2.5rem;
  font-size: ${theme.font.size.sm};
  border: 1px solid ${theme.colors.gray[300]};
  border-radius: ${theme.radius.lg};
  box-sizing: border-box;
  &:focus {
    outline: none;
    border-color: ${theme.colors.orange[500]};
    box-shadow: 0 0 0 2px rgba(249, 115, 22, 0.2);
  }
`;

export const InputWrap = styled.div`
  position: relative;
`;

export const InputIcon = styled.span`
  position: absolute;
  left: ${theme.spacing[3]};
  top: 50%;
  transform: translateY(-50%);
  color: ${theme.colors.gray[400]};
  pointer-events: none;
`;

export const SubmitBtn = styled.button`
  width: 100%;
  padding: ${theme.spacing[2.5]} ${theme.spacing[4]};
  font-size: ${theme.font.size.base};
  font-weight: ${theme.font.weight.semibold};
  background: ${theme.colors.orange[500]};
  color: ${theme.colors.white};
  border: none;
  border-radius: ${theme.radius.lg};
  cursor: pointer;
  margin-top: ${theme.spacing[4]};
  &:hover {
    background: ${theme.colors.orange[600]};
  }
`;

export const LinkBtn = styled.button`
  background: none;
  border: none;
  color: ${theme.colors.orange[600]};
  font-size: ${theme.font.size.sm};
  font-weight: ${theme.font.weight.medium};
  cursor: pointer;
  padding: 0;
  &:hover {
    text-decoration: underline;
  }
`;

export const Divider = styled.div`
  margin: ${theme.spacing[6]} 0;
  text-align: center;
  font-size: ${theme.font.size.sm};
  color: ${theme.colors.gray[500]};
`;
