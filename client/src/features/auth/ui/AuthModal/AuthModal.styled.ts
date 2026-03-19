import styled from "@emotion/styled";
import { theme } from "@/shared/styles/theme";
import { Button } from "@/components/atoms/Button";
import { Field } from "@/components/atoms/Field";

export const ModalHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${theme.spacing[4]};
  padding: ${theme.spacing[5]};
  border-bottom: 1px solid ${theme.colors.gray[200]};
  background: linear-gradient(
    180deg,
    rgba(249, 115, 22, 0.1) 0%,
    rgba(249, 115, 22, 0) 100%
  );
`;

export const CloseBtn = styled(Button)`
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
`;

export const HeaderText = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
`;

export const HeaderBadge = styled.div`
  width: 40px;
  height: 40px;
  border-radius: ${theme.radius.lg};
  background: ${theme.colors.orange[500]};
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex: 0 0 auto;
  box-shadow: 0 10px 20px rgba(249, 115, 22, 0.25);
  img {
    width: 18px;
    height: 18px;
    display: block;
  }
`;

export const HeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing[4]};
  min-width: 0;
`;

export const ModalTitle = styled.h2`
  margin: 0;
  font-size: ${theme.font.size.lg};
  font-weight: ${theme.font.weight.semibold};
  color: ${theme.colors.gray[900]};
`;

export const ModalSubtitle = styled.p`
  margin: 0;
  font-size: ${theme.font.size.sm};
  color: ${theme.colors.gray[500]};
`;

export const FormBody = styled.div`
  padding: ${theme.spacing[5]};
`;

export const FormGroup = styled.div`
  margin-bottom: ${theme.spacing[4]};
`;

export const Label = styled.label`
  display: block;
  margin-bottom: ${theme.spacing[2]};
  font-size: ${theme.font.size.sm};
  font-weight: ${theme.font.weight.medium};
  color: ${theme.colors.gray[700]};
`;

export const Input = styled(Field)`
  width: 100%;
  min-width: 0;
  & input,
  & textarea {
    padding-left: 44px;
  }
`;

export const InputWrap = styled.div<{ $hasToggle?: boolean }>`
  position: relative;
  ${(p) =>
    p.$hasToggle
      ? `
    & input {
      padding-right: 44px;
    }
  `
      : ''}
`;

export const PasswordToggleBtn = styled.button`
  position: absolute;
  right: ${theme.spacing[3]};
  top: 50%;
  transform: translateY(-50%);
  width: 24px;
  height: 24px;
  padding: 0;
  border: none;
  background: none;
  color: ${theme.colors.gray[400]};
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: ${theme.radius.sm};

  &:hover {
    color: ${theme.colors.gray[600]};
  }

  &:focus-visible {
    outline: 2px solid ${theme.colors.orange[500]};
    outline-offset: 2px;
  }

  svg {
    width: 20px;
    height: 20px;
    display: block;
  }
`;

export const InputIcon = styled.span`
  position: absolute;
  left: ${theme.spacing[3]};
  top: 50%;
  transform: translateY(-50%);
  color: ${theme.colors.gray[400]};
  pointer-events: none;
  width: 20px;
  height: 20px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  img {
    display: block;
    width: 20px;
    height: 20px;
  }
`;

export const FieldError = styled.div`
  margin-top: ${theme.spacing[2]};
  font-size: 12px;
  color: ${theme.colors.red[600]};
`;

export const SubmitBtn = styled(Button)`
  width: 100%;
  padding: ${theme.spacing[2.5]} ${theme.spacing[4]};
  font-size: ${theme.font.size.base};
  font-weight: ${theme.font.weight.semibold};
  background: ${theme.colors.orange[500]};
  color: ${theme.colors.white};
  border: none;
  border-radius: ${theme.radius.lg};
  margin-top: ${theme.spacing[4]};
  &:hover:not(:disabled) {
    background: ${theme.colors.orange[600]};
  }
`;

export const LinkBtn = styled(Button)`
  background: none;
  border: none;
  color: ${theme.colors.orange[600]};
  font-size: ${theme.font.size.sm};
  font-weight: ${theme.font.weight.medium};
  padding: 0;
  &:hover {
    text-decoration: underline;
  }
`;

export const Divider = styled.div`
  margin: ${theme.spacing[1]} 0;
  text-align: center;
  font-size: ${theme.font.size.sm};
  color: ${theme.colors.gray[500]};
`;

export const RightRow = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-bottom: 8px;
`;

export const Center = styled.div`
  text-align: center;
`;

export const MutedP = styled.p`
  font-size: 14px;
  color: ${theme.colors.gray[600]};
  margin: 0;
`;
