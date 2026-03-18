import { AppHeader, useAppBootstrapData } from '@/features/appShell';
import { CalendarPage } from '@/features/calendar/app';
import { ConflictModal, EventModal } from '@/features/calendar/modals';
import { EventSidebar } from '@/features/calendar/ui/EventSidebar';
import { AdminModal, AuthModal } from '@/features/auth/ui';
import { ToastViewport } from '@/features/notifications/ui/ToastViewport';
import { Spinner } from '@/components/atoms/Spinner';
import { AppRoot, Centered, Main } from '@/shared/ui/AppLayout.styled';

function App() {
  const { isInitialLoading } = useAppBootstrapData();

  return (
    <AppRoot>
      <AppHeader />
      <Main>
        {isInitialLoading ? (
          <Centered>
            <Spinner />
          </Centered>
        ) : (
          <CalendarPage />
        )}
      </Main>
      <EventModal />
      <ConflictModal />
      <EventSidebar />
      <AuthModal />
      <AdminModal />
      <ToastViewport />
    </AppRoot>
  );
}

export default App;
