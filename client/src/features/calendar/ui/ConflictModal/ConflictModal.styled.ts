import styled from '@emotion/styled';
import { theme } from '@/shared/styles/theme';
import { Button } from '@/components/atoms/Button';

export const Header = styled.div`
  padding: ${theme.spacing[4]};
  border-bottom: 1px solid ${theme.colors.gray[200]};
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: ${theme.spacing[3]};
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

export const Title = styled.h3`
  margin: 0;
  font-size: ${theme.font.size.lg};
  font-weight: ${theme.font.weight.semibold};
  color: ${theme.colors.gray[900]};
  line-height: 1.2;
`;

export const Subtitle = styled.div`
  margin-top: 4px;
  font-size: ${theme.font.size.sm};
  color: ${theme.colors.gray[600]};
`;

export const List = styled.div`
  padding: ${theme.spacing[4]};
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing[2]};
  overflow: auto;
`;

export const Item = styled(Button)`
  width: 100%;
  text-align: left;
  border: 1px solid ${theme.colors.gray[200]};
  background: ${theme.colors.gray[50]};
  border-radius: ${theme.radius.lg};
  padding: ${theme.spacing[3]};
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: ${theme.spacing[3]};
  &:hover {
    background: ${theme.colors.gray[100]};
  }
`;

export const ItemMain = styled.div`
  flex: 1;
  min-width: 0;
`;

export const ItemTitle = styled.div`
  font-size: ${theme.font.size.sm};
  font-weight: ${theme.font.weight.semibold};
  color: ${theme.colors.gray[900]};
  line-height: 1.25;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const ItemMeta = styled.div`
  margin-top: 2px;
  font-size: ${theme.font.size.xs};
  color: ${theme.colors.gray[600]};
`;

export const Chevron = styled.span`
  color: ${theme.colors.gray[400]};
  flex-shrink: 0;
  padding-top: 2px;
`;

export const EmptyState = styled.div`
  padding: ${theme.spacing[4]};
  color: ${theme.colors.gray[600]};
  font-size: ${theme.font.size.sm};
`;

