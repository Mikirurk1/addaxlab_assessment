import styled from '@emotion/styled';
import { theme } from '@/shared/styles/theme';

export const LabelsStrip = styled.div`
  height: 4px;
  display: flex;
  gap: 4px;
  flex-shrink: 0;
  margin-bottom: 6px;
`;

export const LabelSegment = styled.div<{ $color: string }>`
  flex: 1;
  min-width: 4px;
  background: ${(p) => p.$color};
  border-radius: 9999px;
`;

export const CardBody = styled.div`
  padding: 0;
`;

export const CardTitle = styled.span`
  display: block;
  font-size: ${theme.font.size.xs};
  font-weight: ${theme.font.weight.normal};
  color: ${theme.colors.gray[700]};
  line-height: 1.25;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const CardTime = styled.span`
  display: block;
  font-size: 10px;
  color: ${theme.colors.gray[500]};
  line-height: 1.2;
  margin-bottom: 2px;
`;

