import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';
import type { TeamMember, ChoreTemplate, ChoreInstance, CalendarView } from '../types';
import { generateOccurrences, shouldGenerateMoreInstances } from '../utils/recurrence';
import { getDateRange, formatDate, parseDate } from '../utils/date';
import { addMonths } from 'date-fns';

const MEMBER_COLORS = [
  '#3B82F6', // blue
  '#10B981', // emerald
  '#F59E0B', // amber
  '#EF4444', // red
  '#8B5CF6', // violet
  '#EC4899', // pink
  '#06B6D4', // cyan
  '#84CC16', // lime
];

interface AppState {
  teamMembers: TeamMember[];
  choreTemplates: ChoreTemplate[];
  choreInstances: ChoreInstance[];
  calendarView: CalendarView;
  generatedUntil: string;

  // Team member actions
  addTeamMember: (name: string) => void;
  removeTeamMember: (id: string) => void;

  // Chore template actions
  addChoreTemplate: (template: Omit<ChoreTemplate, 'id'>) => void;
  removeChoreTemplate: (id: string) => void;

  // Chore instance actions
  assignChore: (instanceId: string, assigneeId: string | null) => void;
  toggleChoreStatus: (instanceId: string) => void;
  updateChoreDateTime: (instanceId: string, date: string, time?: string) => void;

  // Calendar actions
  setCalendarView: (view: CalendarView) => void;
  ensureInstancesForRange: (endDate: Date) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      teamMembers: [],
      choreTemplates: [],
      choreInstances: [],
      calendarView: 'month',
      generatedUntil: formatDate(addMonths(new Date(), 3)),

      addTeamMember: (name: string) => {
        const { teamMembers } = get();
        const usedColors = new Set(teamMembers.map((m) => m.color));
        const availableColor = MEMBER_COLORS.find((c) => !usedColors.has(c)) || MEMBER_COLORS[teamMembers.length % MEMBER_COLORS.length];

        const newMember: TeamMember = {
          id: uuidv4(),
          name,
          color: availableColor,
        };

        set({ teamMembers: [...teamMembers, newMember] });
      },

      removeTeamMember: (id: string) => {
        const { teamMembers, choreInstances } = get();
        set({
          teamMembers: teamMembers.filter((m) => m.id !== id),
          choreInstances: choreInstances.map((instance) =>
            instance.assigneeId === id ? { ...instance, assigneeId: null } : instance
          ),
        });
      },

      addChoreTemplate: (templateData: Omit<ChoreTemplate, 'id'>) => {
        const { choreTemplates, choreInstances, generatedUntil } = get();
        const template: ChoreTemplate = {
          ...templateData,
          id: uuidv4(),
        };

        const { start, end } = getDateRange(3);
        const occurrences = generateOccurrences(template, start, parseDate(generatedUntil) > end ? parseDate(generatedUntil) : end);

        const newInstances: ChoreInstance[] = occurrences.map((date) => ({
          id: uuidv4(),
          templateId: template.id,
          title: template.title,
          date,
          assigneeId: null,
          status: 'pending',
        }));

        set({
          choreTemplates: [...choreTemplates, template],
          choreInstances: [...choreInstances, ...newInstances],
        });
      },

      removeChoreTemplate: (id: string) => {
        const { choreTemplates, choreInstances } = get();
        set({
          choreTemplates: choreTemplates.filter((t) => t.id !== id),
          choreInstances: choreInstances.filter((i) => i.templateId !== id),
        });
      },

      assignChore: (instanceId: string, assigneeId: string | null) => {
        const { choreInstances } = get();
        set({
          choreInstances: choreInstances.map((instance) =>
            instance.id === instanceId ? { ...instance, assigneeId } : instance
          ),
        });
      },

      toggleChoreStatus: (instanceId: string) => {
        const { choreInstances } = get();
        set({
          choreInstances: choreInstances.map((instance) =>
            instance.id === instanceId
              ? { ...instance, status: instance.status === 'pending' ? 'completed' : 'pending' }
              : instance
          ),
        });
      },

      updateChoreDateTime: (instanceId: string, date: string, time?: string) => {
        const { choreInstances } = get();
        set({
          choreInstances: choreInstances.map((instance) =>
            instance.id === instanceId ? { ...instance, date, time } : instance
          ),
        });
      },

      setCalendarView: (view: CalendarView) => {
        set({ calendarView: view });
      },

      ensureInstancesForRange: (endDate: Date) => {
        const { choreTemplates, choreInstances, generatedUntil } = get();
        const currentEndDate = parseDate(generatedUntil);

        if (endDate <= currentEndDate) return;

        const newInstances: ChoreInstance[] = [];

        choreTemplates.forEach((template) => {
          if (template.recurrence.frequency === 'none') return;

          const existingDates = choreInstances
            .filter((i) => i.templateId === template.id)
            .map((i) => i.date);

          if (!shouldGenerateMoreInstances(existingDates, endDate)) return;

          const occurrences = generateOccurrences(template, currentEndDate, endDate);
          const existingDateSet = new Set(existingDates);

          occurrences
            .filter((date) => !existingDateSet.has(date))
            .forEach((date) => {
              newInstances.push({
                id: uuidv4(),
                templateId: template.id,
                title: template.title,
                date,
                assigneeId: null,
                status: 'pending',
              });
            });
        });

        if (newInstances.length > 0) {
          set({
            choreInstances: [...choreInstances, ...newInstances],
            generatedUntil: formatDate(endDate),
          });
        } else {
          set({ generatedUntil: formatDate(endDate) });
        }
      },
    }),
    {
      name: 'office-chores-storage',
    }
  )
);
