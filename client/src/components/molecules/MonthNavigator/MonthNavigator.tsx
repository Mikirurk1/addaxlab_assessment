import { Button } from '@/components/atoms/Button';
import { Nav, NavLeft, NavCenter, NavRight, MonthTitle, ViewToggle, NavSquareButton, TodayButton } from './MonthNavigator.styled';
import { useT } from '@/features/i18n';

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
  const t = useT();
  return (
    <Nav>
      <NavLeft>
        <TodayButton onClick={onToday}>{t('monthNavigator.today')}</TodayButton>
        <NavSquareButton onClick={onPrev} aria-label={t('monthNavigator.previous')}>
          ‹
        </NavSquareButton>
        <NavSquareButton onClick={onNext} aria-label={t('monthNavigator.next')}>
          ›
        </NavSquareButton>
      </NavLeft>
      <NavCenter>
        <MonthTitle>{title}</MonthTitle>
      </NavCenter>
      <NavRight>
        <ViewToggle>
          <Button
            active={view === 'week'}
            data-active={view === 'week'}
            disabled={view === 'week'}
            aria-disabled={view === 'week'}
            onClick={() => onViewChange('week')}
          >
            {t('monthNavigator.week')}
          </Button>
          <Button
            active={view === 'month'}
            data-active={view === 'month'}
            disabled={view === 'month'}
            aria-disabled={view === 'month'}
            onClick={() => onViewChange('month')}
          >
            {t('monthNavigator.month')}
          </Button>
        </ViewToggle>
      </NavRight>
    </Nav>
  );
}
