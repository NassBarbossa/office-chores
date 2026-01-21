import { useMemo } from 'react';
import { useChoreInstances } from '../store/selectors';
import type { CalendarEvent } from '../types';
import { parseDate } from '../utils/date';

export const useCalendarEvents = (): CalendarEvent[] => {
  const instances = useChoreInstances();

  return useMemo(() => {
    return instances.map((instance) => {
      const start = parseDate(instance.date);
      if (instance.time) {
        const [hours, minutes] = instance.time.split(':').map(Number);
        start.setHours(hours, minutes);
      }
      const end = new Date(start);
      if (instance.time) {
        end.setHours(end.getHours() + 1);
      }
      return {
        id: instance.id,
        title: instance.title,
        start,
        end,
        resource: instance,
      };
    });
  }, [instances]);
};
