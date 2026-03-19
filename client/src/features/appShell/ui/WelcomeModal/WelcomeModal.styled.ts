import styled from '@emotion/styled';
import { theme } from '@/shared/styles/theme';
import { Button } from '@/components/atoms/Button';

export const Header = styled.div`
  padding: ${theme.spacing[6]} ${theme.spacing[6]} ${theme.spacing[4]};
  text-align: center;
  border-bottom: 1px solid ${theme.colors.gray[200]};
`;

export const Title = styled.h2`
  margin: 0 0 ${theme.spacing[2]};
  font-size: ${theme.font.size.xl};
  font-weight: ${theme.font.weight.semibold};
  color: ${theme.colors.gray[900]};
`;

export const Subtitle = styled.p`
  margin: 0;
  font-size: ${theme.font.size.sm};
  color: ${theme.colors.gray[600]};
`;

export const FeatureList = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: ${theme.spacing[4]} ${theme.spacing[6]};
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing[4]};
`;

export const FeatureItem = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing[4]};
`;

export const FeatureIcon = styled.div`
  flex-shrink: 0;
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;

  img {
    width: 40px;
    height: 40px;
    object-fit: contain;
  }
`;

export const FeatureText = styled.p`
  margin: 0;
  font-size: ${theme.font.size.sm};
  color: ${theme.colors.gray[700]};
  line-height: 1.5;
`;

export const Footer = styled.div`
  padding: ${theme.spacing[4]} ${theme.spacing[6]} ${theme.spacing[6]};
  border-top: 1px solid ${theme.colors.gray[200]};
  display: flex;
  justify-content: center;
`;

export const GotItBtn = styled(Button)`
  padding: 10px 24px;
  font-size: ${theme.font.size.base};
  font-weight: ${theme.font.weight.semibold};
  background: ${theme.colors.orange[500]};
  color: ${theme.colors.white};
  border: none;
  border-radius: ${theme.radius.md};
  &:hover {
    background: ${theme.colors.orange[600]};
  }
`;
