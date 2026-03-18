import { useAppDispatch, useAppSelector } from '@/store';
import {
  setSearchQuery,
  setEventModalOpen,
  setEventModalSelectedTime,
  setEditModalTaskId,
  setSidebarOpen,
} from '@/features/calendar/model';
import { setAuthModalOpen } from '@/features/auth/model';
import { useOnlineUsersSocket } from '@/features/appShell/hooks';
import { SearchBar } from '@/components/molecules/SearchBar';
import { UserAvatar } from '@/components/molecules/UserAvatar';
import { Button } from '@/components/atoms/Button';
import { AppHeader as StyledHeader } from '@/shared/ui/AppLayout.styled';
import { ICONS } from '@/shared/assets/icons';
import { useT } from '@/features/i18n';
import { getDisplayNickname } from '@/features/auth/lib/displayNickname';

export function AppHeader() {
  const dispatch = useAppDispatch();
  const searchQuery = useAppSelector((state) => state.ui.searchQuery);
  const currentUser = useAppSelector((state) => state.auth.user);
  const onlineUsers = useAppSelector((state) => state.onlineUsers.list);
  const t = useT();

  useOnlineUsersSocket();

  const currentUserEmail = currentUser?.email?.trim().toLowerCase() ?? '';
  const othersOnline = onlineUsers.filter((u) => u.email.trim().toLowerCase() !== currentUserEmail);
  const displayList = othersOnline.slice(0, 3);
  const extraCount = othersOnline.length - 3;

  return (
    <StyledHeader>
      <div className="header-left">
        <div className="header-title-wrap">
          <span className="header-calendar-icon" aria-hidden>
            <img src={ICONS.calendarWhite} width={20} height={20} alt="" aria-hidden />
          </span>
          <h1>{t('app.title')}</h1>
        </div>
        <Button
          variant="ghost"
          className="header-link"
          onClick={() => {}}
          aria-label={t('header.joinCalendarAria')}
        >
          {t('header.joinCalendar')}
        </Button>
      </div>
      <div className="header-right">
        <div className="header-avatars">
          <div className="header-avatars-list">
            {displayList.map((user) => (
              <UserAvatar
                key={user.id}
                name={user.name}
                email={user.email}
                size={28}
                showDropdown={false}
                displayTitle={getDisplayNickname(user)}
              />
            ))}
          </div>
          {extraCount > 0 && (
            <span className="header-avatars-more">+{extraCount}</span>
          )}
        </div>
        <SearchBar
          value={searchQuery}
          onChange={(v) => dispatch(setSearchQuery(v))}
          placeholder={t('header.searchPlaceholder')}
          variant="header"
        />
        {currentUser && (
          <Button
            className="btn-event"
            onClick={() => {
              dispatch(setEditModalTaskId(null));
              dispatch(setEventModalSelectedTime(null));
              dispatch(setEventModalOpen(true));
            }}
            startIcon={<span aria-hidden>+</span>}
          >
            {t('header.createEvent')}
          </Button>
        )}
        {currentUser ? (
          <div className="btn-avatar" aria-label={currentUser.name}>
            <UserAvatar
              name={currentUser.name}
              email={currentUser.email}
              size={28}
              isCurrentUser
            />
          </div>
        ) : (
          <Button
            className="btn-login"
            onClick={() => dispatch(setAuthModalOpen(true))}
            startIcon={<img src={ICONS.loginWhite} width={16} height={16} alt="" aria-hidden />}
          >
            {t('header.login')}
          </Button>
        )}
        <Button
          className="btn-menu"
          onClick={() => dispatch(setSidebarOpen(true))}
          aria-label={t('header.openMenuAria')}
        >
          <img src={ICONS.filterWhite} width={18} height={18} alt="" aria-hidden />
        </Button>
      </div>
    </StyledHeader>
  );
}

