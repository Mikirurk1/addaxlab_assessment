import { useMemo } from 'react';
import { useAppDispatch, useAppSelector } from '@/store';
import {
  setSidebarOpen,
  setEventModalOpen,
  setEventModalSelectedTime,
  setEditModalTaskId,
  setSearchQuery,
  setSidebarTypeFilter,
  toggleSidebarColorFilter,
  resetSidebarColorFilter,
  toggleSidebarCountryFilter,
  resetSidebarCountryFilter,
} from '@/features/calendar/model';
import { setAuthModalOpen } from '@/features/auth/model';
import { isTaskInPast } from '@/features/calendar/lib/taskTimeRules';
import { isPastDay as isPastDayRule } from '@/features/calendar/lib/rules';
import { HOLIDAY_COUNTRIES } from '@/features/calendar/constants/countries';
import { SearchBar } from '@/components/molecules/SearchBar';
import { LabelColorPicker } from '@/components/molecules/LabelColorPicker';
import type { TaskItem, PublicHoliday } from '@/features/calendar/types';
import { useT } from '@/features/i18n';
import {
  Backdrop,
  Panel,
  SidebarHeader,
  SidebarTitle,
  HeaderActions,
  AddBtn,
  CloseBtn,
  SearchWrap,
  TypeFilterWrap,
  TypeFilterBtn,
  FilterSection,
  FilterLabel,
  CountryFilters,
  CountryFilterBtn,
  ResetFilter,
  EventList,
  EventItem,
  EventColorBar,
  EventContent,
  EventTitle,
  EventMeta,
  HolidayItem,
  HolidayContent,
  HolidayTitle,
  HolidayMeta,
  EmptyState,
  Footer,
} from './EventSidebar.styled';

function formatTaskDate(task: TaskItem, monthAbbrev: string[]): string {
  if (typeof task.date !== 'string' || !task.date) return '';
  const parts = task.date.split('-').map(Number);
  const [y, m, d] = parts;
  if (Number.isNaN(y) || Number.isNaN(m) || Number.isNaN(d)) return '';
  const monthName = monthAbbrev[m - 1] ?? '';
  const time =
    task.startTime && task.endTime ? ` • ${task.startTime} - ${task.endTime}` : '';
  return `${d} ${monthName} ${y}${time}`;
}

function formatHolidayDate(dateKey: string, monthAbbrev: string[]): string {
  const [y, m, d] = dateKey.split('-').map(Number);
  const monthName = monthAbbrev[m - 1] ?? '';
  return `${d} ${monthName} ${y}`;
}

const ISO_DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

type SidebarEntry =
  | { type: 'event'; date: string; task: TaskItem }
  | { type: 'holiday'; date: string; holiday: PublicHoliday };

export function EventSidebar() {
  const dispatch = useAppDispatch();
  const isOpen = useAppSelector((s) => s.ui.sidebarOpen);
  const searchQuery = useAppSelector((s) => s.ui.searchQuery);
  const tasks = useAppSelector((s) => s.tasks.items);
  const holidaysByDate = useAppSelector((s) => s.holidays.byDate);
  const colorFilter = useAppSelector((s) => s.ui.sidebarColorFilter);
  const countryFilter = useAppSelector((s) => s.ui.sidebarCountryFilter);
  const typeFilter = useAppSelector((s) => s.ui.sidebarTypeFilter);
  const currentUser = useAppSelector((s) => s.auth.user);
  const t = useT();
  const monthAbbrev = Array.from({ length: 12 }, (_, i) => t(`date.monthAbbrev.${i}`));

  const filteredTasks = useMemo(() => {
    let list = tasks;
    const now = new Date();
    list = list.filter((t) => !isTaskInPast(t, now));
    if (colorFilter.length > 0) {
      list = list.filter((t) =>
        (t.labels || []).some((l) => colorFilter.includes(l))
      );
    }
    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      list = list.filter((t) => (t.title ?? '').toLowerCase().includes(q));
    }
    return list;
  }, [tasks, colorFilter, searchQuery]);

  const holidayList = useMemo(() => {
    const list: PublicHoliday[] = [];
    for (const listForDate of Object.values(holidaysByDate)) {
      for (const h of listForDate) {
        // Defensive: ignore corrupted/non-standard holiday payloads.
        if (typeof (h as any)?.date !== 'string' || !ISO_DATE_RE.test((h as any).date)) continue;
        if (typeof (h as any)?.countryCode !== 'string' || !(h as any).countryCode.trim()) continue;
        if (isPastDayRule(h.date)) continue;
        if (countryFilter.length === 0 || countryFilter.includes(h.countryCode)) {
          list.push(h);
        }
      }
    }
    return list;
  }, [holidaysByDate, countryFilter]);

  const combinedList = useMemo((): SidebarEntry[] => {
    const entries: SidebarEntry[] = [];
    if (typeFilter === 'all' || typeFilter === 'events') {
      for (const task of filteredTasks) {
        // Backend data may be temporarily inconsistent (e.g. during bootstrap errors),
        // so we defensively guard against missing `date`.
        if (typeof task.date === 'string') entries.push({ type: 'event', date: task.date, task });
      }
    }
    if (typeFilter === 'all' || typeFilter === 'holidays') {
      for (const holiday of holidayList) {
        if (typeof holiday.date === 'string') entries.push({ type: 'holiday', date: holiday.date, holiday });
      }
    }
    entries.sort((a, b) => (a.date ?? '').localeCompare(b.date ?? ''));
    return entries;
  }, [filteredTasks, holidayList, typeFilter]);

  const openModal = () => {
    if (!currentUser) {
      dispatch(setAuthModalOpen(true));
      dispatch(setSidebarOpen(false));
      return;
    }
    dispatch(setEditModalTaskId(null));
    dispatch(setEventModalSelectedTime(null));
    dispatch(setEventModalOpen(true));
    dispatch(setSidebarOpen(false));
  };

  if (!isOpen) return null;

  return (
    <>
      <Backdrop onClick={() => dispatch(setSidebarOpen(false))} />
      <Panel>
        <SidebarHeader>
          <SidebarTitle>{t('eventSidebar.title')}</SidebarTitle>
          <HeaderActions>
            <AddBtn type="button" onClick={openModal}>
              {t('eventSidebar.add')}
            </AddBtn>
            <CloseBtn
              type="button"
              onClick={() => dispatch(setSidebarOpen(false))}
              aria-label={t('eventSidebar.closeAria')}
            >
              ×
            </CloseBtn>
          </HeaderActions>
        </SidebarHeader>

        <SearchWrap>
          <SearchBar
            value={searchQuery}
            onChange={(v) => dispatch(setSearchQuery(v))}
            placeholder={t('eventSidebar.searchPlaceholder')}
          />
        </SearchWrap>

        <FilterSection>
          <FilterLabel>{t('eventSidebar.typeFilterLabel')}</FilterLabel>
          <TypeFilterWrap>
            <TypeFilterBtn
              type="button"
              active={typeFilter === 'all'}
              onClick={() => dispatch(setSidebarTypeFilter('all'))}
            >
              {t('eventSidebar.typeAll')}
            </TypeFilterBtn>
            <TypeFilterBtn
              type="button"
              active={typeFilter === 'events'}
              onClick={() => dispatch(setSidebarTypeFilter('events'))}
            >
              {t('eventSidebar.typeEvents')}
            </TypeFilterBtn>
            <TypeFilterBtn
              type="button"
              active={typeFilter === 'holidays'}
              onClick={() => dispatch(setSidebarTypeFilter('holidays'))}
            >
              {t('eventSidebar.typeHolidays')}
            </TypeFilterBtn>
          </TypeFilterWrap>
        </FilterSection>

        <FilterSection>
          <FilterLabel>{t('eventSidebar.colorFilterLabel')}</FilterLabel>
          <LabelColorPicker
            value={colorFilter}
            onToggle={(hex) => dispatch(toggleSidebarColorFilter(hex))}
          />
          {colorFilter.length > 0 && (
            <ResetFilter type="button" onClick={() => dispatch(resetSidebarColorFilter())}>
              {t('eventSidebar.resetColorFilter')}
            </ResetFilter>
          )}
        </FilterSection>

        <FilterSection>
          <FilterLabel>{t('eventSidebar.countryFilterLabel')}</FilterLabel>
          <CountryFilters>
            {HOLIDAY_COUNTRIES.map(({ code, name }) => (
              <CountryFilterBtn
                key={code}
                type="button"
                active={countryFilter.includes(code)}
                onClick={() => dispatch(toggleSidebarCountryFilter(code))}
              >
                {t(name)}
              </CountryFilterBtn>
            ))}
          </CountryFilters>
          {countryFilter.length > 0 && (
            <ResetFilter type="button" onClick={() => dispatch(resetSidebarCountryFilter())}>
              {t('eventSidebar.resetCountryFilter')}
            </ResetFilter>
          )}
        </FilterSection>

        <EventList>
          {combinedList.map((entry, index) =>
            entry.type === 'event' ? (
              <EventItem
                key={`event-${entry.task._id}`}
                role="button"
                tabIndex={0}
                onClick={() => {
                  dispatch(setEditModalTaskId(entry.task._id));
                  dispatch(setEventModalOpen(true));
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    dispatch(setEditModalTaskId(entry.task._id));
                    dispatch(setEventModalOpen(true));
                  }
                }}
              >
                <EventColorBar
                  $color={
                    (entry.task.labels && entry.task.labels[0]) || '#9ca3af'
                  }
                />
                <EventContent>
                  <EventTitle>{entry.task.title}</EventTitle>
                  <EventMeta>{formatTaskDate(entry.task, monthAbbrev)}</EventMeta>
                </EventContent>
              </EventItem>
            ) : (
              <HolidayItem key={`holiday-${entry.date}-${entry.holiday.countryCode}-${entry.holiday.name}-${index}`}>
                <HolidayContent>
                  <HolidayTitle>{entry.holiday.localName || entry.holiday.name}</HolidayTitle>
                  <HolidayMeta>
                    {formatHolidayDate(entry.date, monthAbbrev)} • {entry.holiday.countryCode}
                  </HolidayMeta>
                </HolidayContent>
              </HolidayItem>
            )
          )}
          {combinedList.length === 0 && (
            <EmptyState>{t('eventSidebar.empty')}</EmptyState>
          )}
        </EventList>

        <Footer>
          {t('eventSidebar.footerEvents')}: <strong>{filteredTasks.length}</strong>
          {' · '}
          {t('eventSidebar.footerHolidays')}: <strong>{holidayList.length}</strong>
        </Footer>
      </Panel>
    </>
  );
}
