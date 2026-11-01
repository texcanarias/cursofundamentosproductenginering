import type { ValidatorFn } from '@angular/forms';

export function isCalendarDate(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value) || value.startsWith('0000-')) return false;
  const date = new Date(`${value}T00:00:00.000Z`);
  return Number.isFinite(date.getTime()) && date.toISOString().slice(0, 10) === value;
}

export const requiredText: ValidatorFn = (control) =>
  typeof control.value === 'string' && control.value.trim() ? null : { required: true };

export const calendarDate: ValidatorFn = (control) =>
  typeof control.value === 'string' && isCalendarDate(control.value) ? null : { date: true };

export function calendarLabel(value: string): string {
  return new Intl.DateTimeFormat('es', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(`${value}T00:00:00.000Z`));
}
