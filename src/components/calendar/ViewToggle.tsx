import React from 'react';
import { useAppStore } from '../../store/useAppStore';
import { useCalendarView } from '../../store/selectors';
import type { CalendarView } from '../../types';

export const ViewToggle: React.FC = () => {
  const calendarView = useCalendarView();
  const setCalendarView = useAppStore((state) => state.setCalendarView);

  const views: { value: CalendarView; label: string }[] = [
    { value: 'month', label: 'Month' },
    { value: 'week', label: 'Week' },
  ];

  return (
    <div className="flex bg-gray-100 rounded-md p-1">
      {views.map((view) => (
        <button
          key={view.value}
          onClick={() => setCalendarView(view.value)}
          className={`px-4 py-1.5 text-sm font-medium rounded transition-colors ${
            calendarView === view.value
              ? 'bg-white text-gray-900 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          {view.label}
        </button>
      ))}
    </div>
  );
};
