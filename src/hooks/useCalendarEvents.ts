import { useMemo } from 'react';
import { useChoreInstances } from '../store/selectors';
import type { CalendarEvent } from '../types';
import { parseDate } from '../utils/date';

export const useCalendarEvents = (): CalendarEvent[] => {
  const instances = useChoreInstances();

  return useMemo(() => {
    return instances.map((instance) => {
      const date = parseDate(instance.date);
      return {
        id: instance.id,
        title: instance.title,
        start: date,
        end: date,
        resource: instance,
      };
    });
  }, [instances]);
};
