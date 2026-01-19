import { format, parseISO, startOfDay, addMonths } from 'date-fns';

export const formatDate = (date: Date): string => {
  return format(date, 'yyyy-MM-dd');
};

export const parseDate = (dateString: string): Date => {
  return parseISO(dateString);
};

export const getToday = (): string => {
  return formatDate(startOfDay(new Date()));
};

export const getDateRange = (monthsAhead: number = 3): { start: Date; end: Date } => {
  const start = startOfDay(new Date());
  const end = addMonths(start, monthsAhead);
  return { start, end };
};
