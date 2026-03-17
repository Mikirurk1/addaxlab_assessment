import styled from '@emotion/styled';
import { theme } from '@/shared/styles/theme';

export const Card = styled.div<{
  $isDragging?: boolean;
  $isHidden?: boolean;
}>`
  background: ${theme.colors.white};
  border-radius: ${theme.radius.md};
  cursor: grab;
  user-select: none;
  overflow: hidden;
  box-shadow: ${theme.shadow.sm};
  padding: ${theme.spacing[2]};
  opacity: ${(p) => (p.$isHidden ? 0.45 : 1)};
  transition: box-shadow 0.15s;
  ${(p) =>
    p.$isDragging &&
    `opacity: 0.9; cursor: grabbing; box-shadow: ${theme.shadow.lg};`}
  &:active {
    cursor: grabbing;
  }
  &:hover {
    box-shadow: ${theme.shadow.md};
  }
`;

/** Figma: flex gap-1 mb-1.5, h-1 flex-1 rounded-full */
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

export const LabelChips = styled.div`
  display: flex;
  gap: ${theme.spacing[1]};
  margin-top: ${theme.spacing[1.5]};
  flex-wrap: wrap;
`;

export const LabelChip = styled.button<{ $color: string; $active: boolean }>`
  width: 20px;
  height: 14px;
  border-radius: ${theme.radius.sm};
  background: ${(p) => p.$color};
  border: 1px solid ${(p) => (p.$active ? theme.colors.gray[800] : 'transparent')};
  cursor: pointer;
  opacity: ${(p) => (p.$active ? 1 : 0.6)};
  &:hover {
    opacity: 1;
  }
`;

export const DeleteBtn = styled.button`
  margin-top: ${theme.spacing[1.5]};
  padding: 0;
  font-size: 11px;
  border: none;
  background: none;
  cursor: pointer;
  color: ${theme.colors.red[600]};
  &:hover {
    text-decoration: underline;
  }
`;
