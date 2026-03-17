import { useState, useMemo } from 'react';
import { useAppDispatch, useAppSelector } from '@/store';
import { setSidebarOpen, setEventModalOpen, setEditModalTaskId, setSearchQuery } from '@/features/calendar/model';
import { MONTHS } from '@/shared/utils/calendar';
import { LABEL_COLORS } from '@/features/calendar/constants/labels';
import { HOLIDAY_COUNTRIES } from '@/features/calendar/constants/countries';
import { SearchBar } from '@/components/molecules/SearchBar';
import type { TaskItem, PublicHoliday } from '@/features/calendar/types';
import {
  Backdrop,
  Panel,
  SidebarHeader,
  SidebarTitle,
  AddBtn,
  CloseBtn,
  SearchWrap,
  TypeFilterWrap,
  TypeFilterBtn,
  FilterSection,
  FilterLabel,
  ColorFilters,
  ColorFilterBtn,
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

function formatTaskDate(task: TaskItem): string {
  const [y, m, d] = task.date.split('-').map(Number);
  const monthName = MONTHS[m - 1]?.slice(0, 3) || '';
  const time =
    task.startTime && task.endTime ? ` • ${task.startTime} - ${task.endTime}` : '';
  return `${d} ${monthName} ${y}${time}`;
}

function formatHolidayDate(dateKey: string): string {
  const [y, m, d] = dateKey.split('-').map(Number);
  const monthName = MONTHS[m - 1]?.slice(0, 3) || '';
  return `${d} ${monthName} ${y}`;
}

type SidebarEntry =
  | { type: 'event'; date: string; task: TaskItem }
  | { type: 'holiday'; date: string; holiday: PublicHoliday };

type SidebarTypeFilter = 'all' | 'events' | 'holidays';

export function EventSidebar() {
  const dispatch = useAppDispatch();
  const isOpen = useAppSelector((s) => s.ui.sidebarOpen);
  const searchQuery = useAppSelector((s) => s.ui.searchQuery);
  const tasks = useAppSelector((s) => s.tasks.items);
  const holidaysByDate = useAppSelector((s) => s.holidays.byDate);
  const [colorFilter, setColorFilter] = useState<string[]>([]);
  const [countryFilter, setCountryFilter] = useState<string[]>([]);
  const [typeFilter, setTypeFilter] = useState<SidebarTypeFilter>('all');

  const toggleColor = (hex: string) => {
    setColorFilter((prev) =>
      prev.includes(hex) ? prev.filter((c) => c !== hex) : [...prev, hex]
    );
  };

  const toggleCountry = (code: string) => {
    setCountryFilter((prev) =>
      prev.includes(code) ? prev.filter((c) => c !== code) : [...prev, code]
    );
  };

  const filteredTasks = useMemo(() => {
    let list = tasks;
    if (colorFilter.length > 0) {
      list = list.filter((t) =>
        (t.labels || []).some((l) => colorFilter.includes(l))
      );
    }
    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      list = list.filter((t) => t.title.toLowerCase().includes(q));
    }
    return list;
  }, [tasks, colorFilter, searchQuery]);

  const holidayList = useMemo(() => {
    const list: PublicHoliday[] = [];
    for (const listForDate of Object.values(holidaysByDate)) {
      for (const h of listForDate) {
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
        entries.push({ type: 'event', date: task.date, task });
      }
    }
    if (typeFilter === 'all' || typeFilter === 'holidays') {
      for (const holiday of holidayList) {
        entries.push({ type: 'holiday', date: holiday.date, holiday });
      }
    }
    entries.sort((a, b) => a.date.localeCompare(b.date));
    return entries;
  }, [filteredTasks, holidayList, typeFilter]);

  const openModal = () => {
    dispatch(setEditModalTaskId(null));
    dispatch(setEventModalOpen(true));
    dispatch(setSidebarOpen(false));
  };

  if (!isOpen) return null;

  return (
    <>
      <Backdrop onClick={() => dispatch(setSidebarOpen(false))} />
      <Panel>
        <SidebarHeader>
          <SidebarTitle>Всі події</SidebarTitle>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <AddBtn type="button" onClick={openModal}>
              + Додати
            </AddBtn>
            <CloseBtn
              type="button"
              onClick={() => dispatch(setSidebarOpen(false))}
              aria-label="Закрити"
            >
              ×
            </CloseBtn>
          </div>
        </SidebarHeader>

        <SearchWrap>
          <SearchBar
            value={searchQuery}
            onChange={(v) => dispatch(setSearchQuery(v))}
            placeholder="Filter tasks..."
          />
        </SearchWrap>

        <FilterSection>
          <FilterLabel>Події / Свята</FilterLabel>
          <TypeFilterWrap>
            <TypeFilterBtn
              type="button"
              $active={typeFilter === 'all'}
              onClick={() => setTypeFilter('all')}
            >
              Всі
            </TypeFilterBtn>
            <TypeFilterBtn
              type="button"
              $active={typeFilter === 'events'}
              onClick={() => setTypeFilter('events')}
            >
              Події
            </TypeFilterBtn>
            <TypeFilterBtn
              type="button"
              $active={typeFilter === 'holidays'}
              onClick={() => setTypeFilter('holidays')}
            >
              Свята
            </TypeFilterBtn>
          </TypeFilterWrap>
        </FilterSection>

        <FilterSection>
          <FilterLabel>Фільтр за кольором</FilterLabel>
          <ColorFilters>
            {LABEL_COLORS.map((opt) => (
              <ColorFilterBtn
                key={opt.value}
                type="button"
                $active={colorFilter.includes(opt.value)}
                onClick={() => toggleColor(opt.value)}
              >
                <span
                  style={{
                    width: 10,
                    height: 10,
                    borderRadius: '50%',
                    background: opt.value,
                  }}
                />
                {opt.label}
              </ColorFilterBtn>
            ))}
          </ColorFilters>
          {colorFilter.length > 0 && (
            <ResetFilter type="button" onClick={() => setColorFilter([])}>
              × Скинути фільтр кольору
            </ResetFilter>
          )}
        </FilterSection>

        <FilterSection>
          <FilterLabel>Фільтр за країною (свята)</FilterLabel>
          <CountryFilters>
            {HOLIDAY_COUNTRIES.map(({ code, name }) => (
              <CountryFilterBtn
                key={code}
                type="button"
                $active={countryFilter.includes(code)}
                onClick={() => toggleCountry(code)}
              >
                {name}
              </CountryFilterBtn>
            ))}
          </CountryFilters>
          {countryFilter.length > 0 && (
            <ResetFilter type="button" onClick={() => setCountryFilter([])}>
              × Скинути фільтр країн
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
                  <EventMeta>{formatTaskDate(entry.task)}</EventMeta>
                </EventContent>
              </EventItem>
            ) : (
              <HolidayItem key={`holiday-${entry.date}-${entry.holiday.countryCode}-${entry.holiday.name}-${index}`}>
                <HolidayContent>
                  <HolidayTitle>{entry.holiday.localName || entry.holiday.name}</HolidayTitle>
                  <HolidayMeta>
                    {formatHolidayDate(entry.date)} • {entry.holiday.countryCode}
                  </HolidayMeta>
                </HolidayContent>
              </HolidayItem>
            )
          )}
          {combinedList.length === 0 && (
            <EmptyState>Немає подій і свят за вибраними фільтрами</EmptyState>
          )}
        </EventList>

        <Footer>
          Подій: <strong>{filteredTasks.length}</strong>
          {' · '}
          Свят: <strong>{holidayList.length}</strong>
        </Footer>
      </Panel>
    </>
  );
}
