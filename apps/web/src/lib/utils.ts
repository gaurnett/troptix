import { clsx, type ClassValue } from "clsx";
import { format } from "date-fns";
import ShortUniqueId from 'short-unique-id';
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getDateFormatter(date) {
  return `${format(date, "MMM dd, yyyy")} @ ${format(date, "hh:mm a")}`;
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