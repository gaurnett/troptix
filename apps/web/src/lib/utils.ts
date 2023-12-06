import { clsx, type ClassValue } from "clsx";
import { format } from "date-fns";
import DOMPurify from "dompurify";
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
};


export function isInputBad(value: string): boolean {
  const cleanValue = DOMPurify.sanitize(value);
  return value !== cleanValue;
}