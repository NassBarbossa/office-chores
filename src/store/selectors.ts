import { useAppStore } from './useAppStore';
import type { CalendarEvent, ChoreInstance, TeamMember } from '../types';
import { parseDate } from '../utils/date';

export const useTeamMembers = () => useAppStore((state) => state.teamMembers);
export const useChoreTemplates = () => useAppStore((state) => state.choreTemplates);
export const useChoreInstances = () => useAppStore((state) => state.choreInstances);
export const useCalendarView = () => useAppStore((state) => state.calendarView);

export const useTeamMemberById = (id: string | null): TeamMember | undefined => {
  return useAppStore((state) => (id ? state.teamMembers.find((m) => m.id === id) : undefined));
};

export const useChoreInstanceById = (id: string): ChoreInstance | undefined => {
  return useAppStore((state) => state.choreInstances.find((i) => i.id === id));
};

export const useCalendarEvents = (): CalendarEvent[] => {
  const instances = useAppStore((state) => state.choreInstances);

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
};
