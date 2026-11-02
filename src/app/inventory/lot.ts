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

export type ExpiryTone = 'expired' | 'soon' | 'upcoming' | 'later';

export interface ExpiryStatus {
  label: string;
  tone: ExpiryTone;
}

export const expiryLabel = calendarLabel;

const DAY = 86_400_000;

export function expiryStatus(caducidad: string, today = new Date()): ExpiryStatus {
  const expiry = Date.parse(`${caducidad}T00:00:00.000Z`);
  if (!Number.isFinite(expiry)) return { label: 'Fecha sin revisar', tone: 'later' };
  const current = Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate());
  const days = Math.ceil((expiry - current) / DAY);
  if (days < 0) return { label: 'Caducado', tone: 'expired' };
  if (days === 0) return { label: 'Caduca hoy', tone: 'soon' };
  if (days <= 7) return { label: `Caduca en ${days} ${days === 1 ? 'día' : 'días'}`, tone: 'soon' };
  if (days <= 30) return { label: `Caduca en ${days} días`, tone: 'upcoming' };
  return { label: 'Caduca en más de 30 días', tone: 'later' };
}

export function lotError(error: unknown): string {
  return storageErrorMessage(error, 'Esta partida ya no está disponible.');
}
