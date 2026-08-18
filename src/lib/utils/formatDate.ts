/**
 * Safe conversion from Firestore Timestamp, Date, string, or serialized Timestamp {_seconds, _nanoseconds} to Date object.
 */
export function toSafeDate(dateVal: any): Date | null {
  if (!dateVal) return null;
  if (typeof dateVal.toDate === 'function') {
    return dateVal.toDate();
  }
  if (dateVal instanceof Date) {
    return dateVal;
  }
  // Handle Firestore JSON serialized timestamp: {_seconds, _nanoseconds}
  if (typeof dateVal === 'object' && typeof dateVal._seconds === 'number') {
    return new Date(dateVal._seconds * 1000);
  }
  if (typeof dateVal === 'object' && typeof dateVal.seconds === 'number') {
    return new Date(dateVal.seconds * 1000);
  }
  if (typeof dateVal === 'string' || typeof dateVal === 'number') {
    const d = new Date(dateVal);
    return isNaN(d.getTime()) ? null : d;
  }
  return null;
}

/**
 * Format date for display in Indian standard format (e.g., "15 Aug 2026")
 */
export function formatDisplayDate(dateVal: any, includeDay: boolean = true): string {
  const d = toSafeDate(dateVal);
  if (!d) return 'TBA';
  return d.toLocaleDateString('en-IN', {
    day: includeDay ? 'numeric' : undefined,
    month: 'short',
    year: 'numeric',
  });
}

/**
 * Format date and time for display (e.g., "15 Aug 2026, 06:00 PM")
 */
export function formatDisplayDateTime(dateVal: any): string {
  const d = toSafeDate(dateVal);
  if (!d) return 'TBA';
  
  const datePart = d.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  const timePart = d.toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });

  // If time is exactly 00:00:00 (midnight) from an old date-only entry, show date only
  if (d.getHours() === 0 && d.getMinutes() === 0 && d.getSeconds() === 0) {
    return `${datePart} (11:59 PM)`;
  }

  return `${datePart}, ${timePart}`;
}

/**
 * Format date for <input type="datetime-local" /> (YYYY-MM-DDTHH:mm)
 */
export function formatDateTimeForInput(dateVal: any): string {
  const d = toSafeDate(dateVal);
  if (!d) return '';
  
  const pad = (n: number) => n.toString().padStart(2, '0');
  const year = d.getFullYear();
  const month = pad(d.getMonth() + 1);
  const day = pad(d.getDate());
  const hours = pad(d.getHours());
  const minutes = pad(d.getMinutes());

  return `${year}-${month}-${day}T${hours}:${minutes}`;
}
