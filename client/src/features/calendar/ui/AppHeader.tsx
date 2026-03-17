import { useAppDispatch, useAppSelector } from '@/store';
import {
  setSearchQuery,
  setEventModalOpen,
  setEditModalTaskId,
  setAuthModalOpen,
  setSidebarOpen,
} from '@/features/calendar/model';
import { SearchBar } from '@/components/molecules/SearchBar';
import { InitialsAvatar } from '@/components/atoms/InitialsAvatar';
import { AppHeader as StyledHeader } from '@/shared/ui/AppLayout.styled';

const ONLINE_USERS = [
  { id: '1', name: 'Anna K' },
  { id: '2', name: 'Petro M' },
  { id: '3', name: 'Olena S' },
  { id: '4', name: 'Ivan D' },
  { id: '5', name: 'Maria T' },
];

export function AppHeader() {
  const dispatch = useAppDispatch();
  const searchQuery = useAppSelector((state) => state.ui.searchQuery);

  return (
    <StyledHeader>
      <div className="header-left">
        <div className="header-title-wrap">
          <span className="header-calendar-icon" aria-hidden>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
          </span>
          <h1>Personal Calendar</h1>
        </div>
        <button
          type="button"
          className="header-link"
          onClick={() => {}}
          aria-label="Приєднати до свого календаря"
        >
          Приєднати до свого календаря
        </button>
      </div>
      <div className="header-right">
        <div className="header-avatars">
          <div className="header-avatars-list">
            {ONLINE_USERS.slice(0, 3).map((user) => (
              <InitialsAvatar
                key={user.id}
                name={user.name}
                size={28}
                title={user.name}
              />
            ))}
          </div>
          {ONLINE_USERS.length > 3 && (
            <span style={{ fontSize: 14, fontWeight: 500 }}>
              +{ONLINE_USERS.length - 3}
            </span>
          )}
        </div>
        <SearchBar
          value={searchQuery}
          onChange={(v) => dispatch(setSearchQuery(v))}
          placeholder="Filter tasks..."
          variant="header"
        />
        <button
          type="button"
          className="btn-event"
          onClick={() => {
            dispatch(setEditModalTaskId(null));
            dispatch(setEventModalOpen(true));
          }}
        >
          <span aria-hidden>+</span>
          Подія
        </button>
        <button
          type="button"
          className="btn-login"
          onClick={() => dispatch(setAuthModalOpen(true))}
        >
          Вхід
        </button>
        <button
          type="button"
          className="btn-menu"
          onClick={() => dispatch(setSidebarOpen(true))}
          aria-label="Відкрити меню"
        >
          ☰
        </button>
      </div>
    </StyledHeader>
  );
}
