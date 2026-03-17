import { IconButton } from '@/components/atoms/IconButton';
import { Nav, NavLeft, NavCenter, NavRight, MonthTitle, ViewToggle } from './MonthNavigator.styled';

interface MonthNavigatorProps {
  title: string;
  view: 'week' | 'month';
  onPrev: () => void;
  onNext: () => void;
  onToday: () => void;
  onViewChange: (v: 'week' | 'month') => void;
}

export function MonthNavigator({
  title,
  view,
  onPrev,
  onNext,
  onToday,
  onViewChange,
}: MonthNavigatorProps) {
  return (
    <Nav>
      <NavLeft>
        <IconButton onClick={onToday}>Today</IconButton>
        <IconButton onClick={onPrev} aria-label="Previous">
          ‹
        </IconButton>
        <IconButton onClick={onNext} aria-label="Next">
          ›
        </IconButton>
      </NavLeft>
      <NavCenter>
        <MonthTitle>{title}</MonthTitle>
      </NavCenter>
      <NavRight>
        <ViewToggle>
          <IconButton active={view === 'week'} data-active={view === 'week'} onClick={() => onViewChange('week')}>
            Week
          </IconButton>
          <IconButton active={view === 'month'} data-active={view === 'month'} onClick={() => onViewChange('month')}>
            Month
          </IconButton>
        </ViewToggle>
      </NavRight>
    </Nav>
  );
}
