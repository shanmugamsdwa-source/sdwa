import { clsx, type ClassValue } from 'clsx';

/**
 * Merge class names conditionally.
 */
export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

/**
 * Generate a URL-friendly slug from a string.
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * Format a season string from start and end years.
 */
export function formatSeason(startYear: number, endYear: number): string {
  return `${startYear}/${endYear}`;
}

/**
 * Format a date for display.
 */
export function formatDate(date: Date | { toDate: () => Date }): string {
  const d = 'toDate' in date ? date.toDate() : date;
  return d.toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

/**
 * Format a date range.
 */
export function formatDateRange(
  start: Date | { toDate: () => Date },
  end: Date | { toDate: () => Date }
): string {
  const s = 'toDate' in start ? start.toDate() : start;
  const e = 'toDate' in end ? end.toDate() : end;

  const sameMonth = s.getMonth() === e.getMonth() && s.getFullYear() === e.getFullYear();

  if (sameMonth) {
    return `${s.getDate()} – ${e.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    })}`;
  }

  return `${formatDate(s)} – ${formatDate(e)}`;
}

/**
 * Truncate text to a maximum length.
 */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + '…';
}

/**
 * Delay execution for a given number of milliseconds.
 */
export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
