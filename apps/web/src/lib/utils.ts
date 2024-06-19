import { clsx, type ClassValue } from 'clsx';
import { formatInTimeZone } from 'date-fns-tz';
import DOMPurify from 'dompurify';
import ShortUniqueId from 'short-unique-id';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getDateFormatter(date: Date) {
  return `${formatInTimeZone(date, 'America/New_York', 'MMM dd, yyyy, h:mm a')}`;
}

export function getDateRangeFormatter(start: Date, end: Date) {
  const startDate = formatInTimeZone(start, 'America/New_York', 'EEEE MMM dd, yyyy');
  const endDate = formatInTimeZone(end, 'America/New_York', 'EEEE MMM dd, yyyy');

  if (startDate !== endDate) {
    return `${startDate} - ${endDate}`;
  }

  return startDate;
}

export function getTimeRangeFormatter(start: Date, end: Date) {
  return `${formatInTimeZone(start, 'America/New_York', 'h:mm a')} - ${formatInTimeZone(end, 'America/New_York', 'h:mm a')}`;
}

export function getFormattedCurrency(price) {
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  });

  return formatter.format(price);
}

export function generateId() {
  const uid = new ShortUniqueId({
    dictionary: 'alphanum_upper',
    length: 12,
  });

  return uid.rnd();
}

export function generateJwtId() {
  const uid = new ShortUniqueId({ length: 16 });

  return uid.rnd();
}

export function isValidEmail(email) {
  return String(email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
}

export function isInputBad(value: string): boolean {
  const cleanValue = DOMPurify.sanitize(value);
  return value !== cleanValue;
}

export function calculateFees(price) {
  const fee = price * 0.06 + 0.3;
  const tax = fee * 0.15;
  return normalizePrice(fee + tax);
}

export function normalizePrice(price): number {
  return Math.round(price * 100) / 100;
}
