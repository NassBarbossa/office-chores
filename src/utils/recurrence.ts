import { RRule, Frequency } from 'rrule';
import type { ChoreTemplate } from '../types';
import { formatDate } from './date';

const frequencyMap: Record<ChoreTemplate['recurrence']['frequency'], Frequency | null> = {
  none: null,
  daily: RRule.DAILY,
  weekly: RRule.WEEKLY,
  monthly: RRule.MONTHLY,
};

export const generateOccurrences = (
  template: ChoreTemplate,
  startDate: Date,
  endDate: Date
): string[] => {
  const { frequency, interval, endDate: recurrenceEndDate } = template.recurrence;

  if (frequency === 'none') {
    return [formatDate(startDate)];
  }

  const freq = frequencyMap[frequency];
  if (freq === null) {
    return [formatDate(startDate)];
  }

  const rule = new RRule({
    freq,
    interval,
    dtstart: startDate,
    until: recurrenceEndDate ? new Date(recurrenceEndDate) : endDate,
  });

  return rule.between(startDate, endDate, true).map(formatDate);
};

export const shouldGenerateMoreInstances = (
  existingDates: string[],
  viewEndDate: Date
): boolean => {
  if (existingDates.length === 0) return true;

  const latestDate = existingDates.sort().reverse()[0];
  return new Date(latestDate) < viewEndDate;
};
