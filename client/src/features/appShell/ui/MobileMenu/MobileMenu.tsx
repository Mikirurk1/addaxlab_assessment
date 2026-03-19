import { useAppDispatch, useAppSelector } from '@/store';
import {
  setSearchQuery,
  setEventModalOpen,
  setEventModalSelectedTime,
  setEditModalTaskId,
  setMobileMenuOpen,
} from '@/features/calendar/model';
import { setAuthModalOpen } from '@/features/auth/model';
import { SearchBar } from '@/components/molecules/SearchBar';
import { UserAvatar } from '@/components/molecules/UserAvatar';
import { Button } from '@/components/atoms/Button';
import { useT } from '@/features/i18n';
import { pushToast } from '@/features/notifications/model/notificationsSlice';
import {
  Backdrop,
  Panel,
  MenuHeader,
  MenuTitle,
  CloseBtn,
  MenuContent,
  MenuSection,
  MenuSectionLabel,
  AvatarSection,
  AddEventBtn,
  ShareBtn,
} from './MobileMenu.styled';

export function MobileMenu() {
  const dispatch = useAppDispatch();
  const isOpen = useAppSelector((s) => s.ui.mobileMenuOpen);
  const searchQuery = useAppSelector((s) => s.ui.searchQuery);
  const currentUser = useAppSelector((s) => s.auth.user);
  const t = useT();

  const handleJoinCalendar = async () => {
    const shareUrl = window.location.origin;
    try {
      await navigator.clipboard.writeText(shareUrl);
      dispatch(pushToast({ kind: 'success', title: t('header.joinCalendarCopied') }));
      dispatch(setMobileMenuOpen(false));
    } catch {
      dispatch(pushToast({ kind: 'error', title: t('header.joinCalendarCopyFailed') }));
    }
  };

  const handleCreateEvent = () => {
    if (!currentUser) {
      dispatch(setAuthModalOpen(true));
      dispatch(setMobileMenuOpen(false));
      return;
    }
    dispatch(setEditModalTaskId(null));
    dispatch(setEventModalSelectedTime(null));
    dispatch(setEventModalOpen(true));
    dispatch(setMobileMenuOpen(false));
  };

  if (!isOpen) return null;

  return (
    <>
      <Backdrop onClick={() => dispatch(setMobileMenuOpen(false))} />
      <Panel>
        <MenuHeader>
          <MenuTitle>{t('header.mobileMenuTitle')}</MenuTitle>
          <CloseBtn
            type="button"
            onClick={() => dispatch(setMobileMenuOpen(false))}
            aria-label={t('header.closeMenuAria')}
          >
            ×
          </CloseBtn>
        </MenuHeader>

        <MenuContent>
          <AvatarSection>
            {currentUser ? (
              <UserAvatar
                name={currentUser.name}
                email={currentUser.email}
                size={48}
                isCurrentUser
              />
            ) : (
              <Button
                variant="ghost"
                onClick={() => {
                  dispatch(setAuthModalOpen(true));
                  dispatch(setMobileMenuOpen(false));
                }}
              >
                {t('header.login')}
              </Button>
            )}
          </AvatarSection>

          <MenuSection>
            <MenuSectionLabel>{t('header.searchPlaceholder')}</MenuSectionLabel>
            <SearchBar
              value={searchQuery}
              onChange={(v) => dispatch(setSearchQuery(v))}
              placeholder={t('header.searchPlaceholder')}
            />
          </MenuSection>

          <MenuSection>
            <MenuSectionLabel>{t('header.createEvent')}</MenuSectionLabel>
            <AddEventBtn onClick={handleCreateEvent} startIcon={<span aria-hidden>+</span>}>
              {t('header.createEvent')}
            </AddEventBtn>
          </MenuSection>

          <MenuSection>
            <MenuSectionLabel>{t('header.joinCalendar')}</MenuSectionLabel>
            <ShareBtn onClick={handleJoinCalendar} aria-label={t('header.joinCalendarAria')}>
              {t('header.joinCalendar')}
            </ShareBtn>
          </MenuSection>
        </MenuContent>
      </Panel>
    </>
  );
}
