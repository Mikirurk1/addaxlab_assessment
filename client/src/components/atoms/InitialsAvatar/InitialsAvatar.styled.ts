import styled from '@emotion/styled';
import { theme } from '@/shared/styles/theme';

export const AvatarCircle = styled.div<{ $bg: string; $size: number }>`
  width: ${(p) => p.$size}px;
  height: ${(p) => p.$size}px;
  border-radius: 50%;
  background: ${(p) => p.$bg};
  color: ${theme.colors.white};
  font-size: ${(p) => Math.max(10, p.$size * 0.4)}px;
  font-weight: ${theme.font.weight.semibold};
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  border: 2px solid ${theme.colors.orange[500]};
  box-sizing: border-box;
`;

export const AvatarImageWrap = styled.div<{ $size: number }>`
  width: ${(p) => p.$size}px;
  height: ${(p) => p.$size}px;
  border-radius: 50%;
  overflow: hidden;
  flex-shrink: 0;
  border: 2px solid ${theme.colors.orange[500]};
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${theme.colors.gray[200]};
`;

export const AvatarImg = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;
