import { useCalendarData } from '@/features/calendar/hooks';
import { AppHeader } from '@/features/calendar/ui/AppHeader';
import { CalendarPage } from '@/features/calendar/ui/CalendarPage';
import { EventModal } from '@/features/calendar/ui/EventModal';
import { EventSidebar } from '@/features/calendar/ui/EventSidebar';
import { AuthModal } from '@/features/calendar/ui/AuthModal';
import { Spinner } from '@/components/atoms/Spinner';
import { AppRoot, Main } from '@/shared/ui/AppLayout.styled';

function App() {
  const { loading } = useCalendarData();

  return (
    <AppRoot>
      <AppHeader />
      <Main>
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: 48 }}>
            <Spinner />
          </div>
        ) : (
          <CalendarPage />
        )}
      </Main>
      <EventModal />
      <EventSidebar />
      <AuthModal />
    </AppRoot>
  );
}

export default App;
