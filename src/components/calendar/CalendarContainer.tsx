import React, { useState, useCallback, useMemo } from 'react';
import { Calendar, dateFnsLocalizer, Views } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay, addMonths } from 'date-fns';
import { enUS } from 'date-fns/locale/en-US';
import { useCalendarEvents, useCalendarView } from '../../store/selectors';
import { useAppStore } from '../../store/useAppStore';
import { ChoreEvent } from './ChoreEvent';
import { AssignChoreModal } from '../modals/AssignChoreModal';
import type { CalendarEvent } from '../../types';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import '../../styles/calendar.css';

const locales = { 'en-US': enUS };

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

export const CalendarContainer: React.FC = () => {
  const events = useCalendarEvents();
  const calendarView = useCalendarView();
  const ensureInstancesForRange = useAppStore((state) => state.ensureInstancesForRange);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [currentDate, setCurrentDate] = useState(new Date());

  const handleSelectEvent = useCallback((event: CalendarEvent) => {
    setSelectedEvent(event);
  }, []);

  const handleNavigate = useCallback((date: Date) => {
    setCurrentDate(date);
    ensureInstancesForRange(addMonths(date, 3));
  }, [ensureInstancesForRange]);

  const handleCloseModal = useCallback(() => {
    setSelectedEvent(null);
  }, []);

  const components = useMemo(
    () => ({
      event: ChoreEvent,
    }),
    []
  );

  const view = calendarView === 'month' ? Views.MONTH : Views.WEEK;

  return (
    <div className="h-full bg-white rounded-lg shadow">
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: '100%', minHeight: 600 }}
        view={view}
        date={currentDate}
        onNavigate={handleNavigate}
        onSelectEvent={handleSelectEvent}
        components={components}
        views={[Views.MONTH, Views.WEEK]}
        toolbar={true}
      />
      <AssignChoreModal
        event={selectedEvent}
        onClose={handleCloseModal}
      />
    </div>
  );
};
