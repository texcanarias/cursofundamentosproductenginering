import { calendarDate, calendarLabel, isCalendarDate, requiredText } from '../shared/calendar-date';
import { storageErrorMessage } from '../shared/errors';

export { calendarDate, isCalendarDate, requiredText };

export interface LotData {
  nombreProducto: string;
  caducidad: string;
  ubicacion: string;
}

export interface Lot extends LotData {
  id: string;
}

export const expiryLabel = calendarLabel;

export function lotError(error: unknown): string {
  return storageErrorMessage(error, 'Esta partida ya no está disponible.');
}
