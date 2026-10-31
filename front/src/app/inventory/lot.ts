import { HttpErrorResponse } from '@angular/common/http';
import type { ValidatorFn } from '@angular/forms';

export interface LotData {
  nombreProducto: string;
  caducidad: string;
  ubicacion: string;
}

export interface Lot extends LotData {
  id: string;
}

export function isCalendarDate(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value) || value.startsWith('0000-')) return false;
  const date = new Date(`${value}T00:00:00.000Z`);
  return Number.isFinite(date.getTime()) && date.toISOString().slice(0, 10) === value;
}

export const requiredText: ValidatorFn = (control) =>
  typeof control.value === 'string' && control.value.trim() ? null : { required: true };

export const calendarDate: ValidatorFn = (control) =>
  typeof control.value === 'string' && isCalendarDate(control.value) ? null : { date: true };

export function expiryLabel(value: string): string {
  return new Intl.DateTimeFormat('es', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(`${value}T00:00:00.000Z`));
}

export function lotError(error: unknown): string {
  if (!(error instanceof HttpErrorResponse)) return 'No se pudo completar la operación.';
  if (error.status === 0) return 'No hay conexión con el servidor. Inténtalo de nuevo.';
  if (error.status === 404) return 'Esta partida ya no está disponible.';
  return typeof error.error?.error?.mensaje === 'string'
    ? error.error.error.mensaje
    : 'No se pudo completar la operación. Inténtalo de nuevo.';
}
