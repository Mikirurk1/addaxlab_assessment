import styled from '@emotion/styled';
import { theme } from '@/shared/styles/theme';

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
  width: 24rem;
  max-width: 100%;
  height: 100%;
  background: ${theme.colors.white};
  box-shadow: ${theme.shadow['2xl']};
  z-index: 50;
  display: flex;
  flex-direction: column;
`;

export const SidebarHeader = styled.div`
  padding: ${theme.spacing[4]};
  border-bottom: 1px solid ${theme.colors.gray[200]};
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const SidebarTitle = styled.h2`
  margin: 0;
  font-size: ${theme.font.size.lg};
  font-weight: ${theme.font.weight.semibold};
  color: ${theme.colors.gray[800]};
`;

export const AddBtn = styled.button`
  padding: 6px 12px;
  font-size: ${theme.font.size.sm};
  background: ${theme.colors.orange[500]};
  color: ${theme.colors.white};
  border: none;
  border-radius: ${theme.radius.md};
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: ${theme.spacing[1.5]};
  font-weight: ${theme.font.weight.medium};
  transition: background 0.15s;
  &:hover {
    background: ${theme.colors.orange[600]};
  }
`;

export const CloseBtn = styled.button`
  padding: ${theme.spacing[1]};
  border: none;
  background: none;
  cursor: pointer;
  border-radius: ${theme.radius.sm};
  color: ${theme.colors.gray[600]};
  font-size: 1.25rem;
  line-height: 1;
  &:hover {
    background: ${theme.colors.gray[100]};
  }
`;

export const SearchWrap = styled.div`
  padding: ${theme.spacing[4]};
  border-bottom: 1px solid ${theme.colors.gray[200]};
  & input {
    width: 100%;
    min-width: 0;
    box-sizing: border-box;
  }
`;

export const TypeFilterWrap = styled.div`
  display: flex;
  gap: ${theme.spacing[2]};
`;

export const TypeFilterBtn = styled.button<{ $active: boolean }>`
  flex: 1;
  padding: 8px 12px;
  font-size: ${theme.font.size.xs};
  border-radius: ${theme.radius.md};
  border: 1px solid ${theme.colors.gray[200]};
  cursor: pointer;
  background: ${(p) => (p.$active ? theme.colors.orange[500] : theme.colors.white)};
  color: ${(p) => (p.$active ? theme.colors.white : theme.colors.gray[700])};
  font-weight: ${theme.font.weight.medium};
  &:hover {
    background: ${(p) => (p.$active ? theme.colors.orange[600] : theme.colors.gray[50])};
  }
`;

export const FilterSection = styled.div`
  padding: ${theme.spacing[4]};
  border-bottom: 1px solid ${theme.colors.gray[200]};
`;

export const FilterLabel = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing[2]};
  font-size: ${theme.font.size.sm};
  font-weight: ${theme.font.weight.medium};
  color: ${theme.colors.gray[700]};
  margin-bottom: ${theme.spacing[3]};
`;

export const ColorFilters = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${theme.spacing[2]};
`;

export const ColorFilterBtn = styled.button<{ $active: boolean }>`
  padding: 6px 12px;
  font-size: ${theme.font.size.xs};
  border-radius: 9999px;
  display: inline-flex;
  align-items: center;
  gap: ${theme.spacing[2]};
  border: none;
  cursor: pointer;
  background: ${(p) => (p.$active ? theme.colors.gray[800] : theme.colors.gray[100])};
  color: ${(p) => (p.$active ? theme.colors.white : theme.colors.gray[700])};
  font-weight: ${theme.font.weight.medium};
  &:hover {
    background: ${(p) => (p.$active ? theme.colors.gray[700] : theme.colors.gray[200])};
  }
`;

export const ResetFilter = styled.button`
  margin-top: ${theme.spacing[3]};
  padding: 6px 12px;
  font-size: ${theme.font.size.xs};
  font-weight: ${theme.font.weight.medium};
  color: ${theme.colors.gray[600]};
  background: ${theme.colors.white};
  border: 1px solid ${theme.colors.gray[300]};
  border-radius: ${theme.radius.md};
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  transition: background 0.15s, border-color 0.15s, color 0.15s;
  &:hover {
    background: ${theme.colors.gray[50]};
    border-color: ${theme.colors.gray[400]};
    color: ${theme.colors.gray[800]};
  }
`;

export const CountryFilters = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${theme.spacing[2]};
`;

export const CountryFilterBtn = styled.button<{ $active: boolean }>`
  padding: 6px 12px;
  font-size: ${theme.font.size.xs};
  border-radius: 9999px;
  display: inline-flex;
  align-items: center;
  border: none;
  cursor: pointer;
  background: ${(p) => (p.$active ? theme.colors.orange[500] : theme.colors.gray[100])};
  color: ${(p) => (p.$active ? theme.colors.white : theme.colors.gray[700])};
  font-weight: ${theme.font.weight.medium};
  &:hover {
    background: ${(p) => (p.$active ? theme.colors.orange[600] : theme.colors.gray[200])};
  }
`;

export const HolidayItem = styled.div`
  background: #fef3c7;
  border-radius: ${theme.radius.lg};
  padding: ${theme.spacing[3]};
  display: flex;
  align-items: flex-start;
  gap: ${theme.spacing[3]};
  border-left: 4px solid #f59e0b;
  &:hover {
    background: #fde68a;
  }
`;

export const HolidayContent = styled.div`
  flex: 1;
  min-width: 0;
`;

export const HolidayTitle = styled.div`
  font-size: ${theme.font.size.sm};
  font-weight: ${theme.font.weight.medium};
  color: ${theme.colors.gray[900]};
  margin-bottom: ${theme.spacing[1]};
`;

export const HolidayMeta = styled.div`
  font-size: ${theme.font.size.xs};
  color: ${theme.colors.gray[600]};
`;

export const EventList = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: ${theme.spacing[4]};
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing[3]};
`;

export const EventItem = styled.div`
  background: ${theme.colors.gray[50]};
  border-radius: ${theme.radius.lg};
  padding: ${theme.spacing[3]};
  display: flex;
  align-items: flex-start;
  gap: ${theme.spacing[3]};
  cursor: pointer;
  transition: background 0.15s;
  &:hover {
    background: ${theme.colors.gray[100]};
  }
`;

export const EventColorBar = styled.div<{ $color: string }>`
  width: 4px;
  border-radius: 2px;
  background: ${(p) => p.$color};
  flex-shrink: 0;
`;

export const EventContent = styled.div`
  flex: 1;
  min-width: 0;
`;

export const EventTitle = styled.div`
  font-size: ${theme.font.size.sm};
  font-weight: ${theme.font.weight.medium};
  color: ${theme.colors.gray[900]};
  margin-bottom: ${theme.spacing[1]};
`;

export const EventMeta = styled.div`
  font-size: ${theme.font.size.xs};
  color: ${theme.colors.gray[500]};
`;

export const EmptyState = styled.div`
  text-align: center;
  padding: 3rem ${theme.spacing[4]};
  font-size: ${theme.font.size.sm};
  color: ${theme.colors.gray[400]};
`;

export const Footer = styled.div`
  padding: ${theme.spacing[4]};
  border-top: 1px solid ${theme.colors.gray[200]};
  background: ${theme.colors.gray[50]};
  font-size: ${theme.font.size.sm};
  color: ${theme.colors.gray[600]};
`;
