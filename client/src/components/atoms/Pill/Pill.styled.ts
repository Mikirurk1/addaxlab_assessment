import styled from '@emotion/styled';
import { theme } from '@/shared/styles/theme';

export const Pill = styled.span<{ tone?: 'default' | 'holiday' }>`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 10px;
  line-height: 1.3;
  border-radius: ${theme.radius.sm};
  padding: 2px 6px;
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;

  color: ${(p) => (p.tone === 'holiday' ? '#92400e' : theme.colors.gray[700])};
  background: ${(p) => (p.tone === 'holiday' ? '#fef3c7' : theme.colors.gray[100])};
  border: 1px solid ${(p) => (p.tone === 'holiday' ? '#fcd34d' : theme.colors.gray[200])};
`;

