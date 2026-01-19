import { MainLayout } from './components/layout/MainLayout';
import { CalendarContainer } from './components/calendar/CalendarContainer';
import { useEnsureInstances } from './hooks/useEnsureInstances';

function App() {
  useEnsureInstances();

  return (
    <MainLayout>
      <CalendarContainer />
    </MainLayout>
  );
}

export default App;
