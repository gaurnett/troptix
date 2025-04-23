import { formatInTimeZone } from 'date-fns-tz';

export function getDateFormatter(date: Date) {
  return `${formatInTimeZone(date, 'America/New_York', 'MMM dd, yyyy, h:mm a')}`;
}

export function getDateRangeFormatter(start: Date, end: Date) {
  const startDate = formatInTimeZone(
    start,
    'America/New_York',
    'EEEE MMM dd, yyyy'
  );
  const endDate = formatInTimeZone(
    end,
    'America/New_York',
    'EEEE MMM dd, yyyy'
  );

  if (startDate !== endDate) {
    return `${startDate} - ${endDate}`;
  }

  return startDate;
}

export function getTimeRangeFormatter(start: Date, end: Date) {
  return `${formatInTimeZone(start, 'America/New_York', 'h:mm a')} - ${formatInTimeZone(end, 'America/New_York', 'h:mm a')}`;
}
