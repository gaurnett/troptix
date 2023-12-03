import { clsx, type ClassValue } from "clsx";
import { formatInTimeZone } from 'date-fns-tz';
import ShortUniqueId from 'short-unique-id';
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getDateFormatter(date: Date) {
  return `${formatInTimeZone(date, 'America/New_York', "MMM dd, yyyy, h:mm a")} EST`;
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
    length: 12
  });

  return uid.rnd();
}