export interface TeamMember {
  id: string;
  name: string;
  color: string;
}

export interface ChoreTemplate {
  id: string;
  title: string;
  description?: string;
  recurrence: {
    frequency: 'none' | 'daily' | 'weekly' | 'monthly';
    interval: number;
    endDate?: number;
  };
}

export interface ChoreInstance {
  id: string;
  templateId: string;
  title: string;
  date: string; // YYYY-MM-DD
  time?: string; // HH:mm (optional, for timed events)
  assigneeId: string | null;
  status: 'pending' | 'completed';
}

export type CalendarView = 'month' | 'week';

export interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  resource: ChoreInstance;
}
