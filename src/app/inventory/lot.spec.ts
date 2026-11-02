import { FormControl } from '@angular/forms';
import { LocalStorageError } from '../shared/browser-storage';
import { NotFoundError } from '../shared/browser-repository';
import {
  calendarDate,
  expiryLabel,
  expiryStatus,
  isCalendarDate,
  lotError,
  requiredText,
} from './lot';

describe('Inventory dates and validation', () => {
  it.each(['2024-02-29', '2000-02-29', '1999-01-01', '2027-03-15'])(
    'accepts real calendar dates including past dates: %s',
    (value) => expect(isCalendarDate(value)).toBe(true),
  );

  it.each([
    '2027-02-29',
    '1900-02-29',
    '2027-02-30',
    '2027-13-01',
    '15/03/2027',
    '2027-03-15T00:00:00Z',
    '',
    '0000-01-01',
  ])('rejects invalid date %s', (value) =>
    expect(calendarDate(new FormControl(value))).toEqual({ date: true }),
  );

  it.each(['', '   ', null, 123])('rejects empty or non-text fields: %s', (value) => {
    expect(requiredText(new FormControl(value))).toEqual({ required: true });
  });

  it('formats the calendar day without timezone shifts', () => {
    expect(expiryLabel('1999-01-01')).toBe('1 de enero de 1999');
    expect(requiredText(new FormControl('Arroz'))).toBeNull();
  });

  it('provides actionable error messages without claiming success', () => {
    expect(lotError(new LocalStorageError(0))).toContain('No se pudieron leer');
    expect(lotError(new NotFoundError())).toContain('ya no está disponible');
    expect(lotError(new LocalStorageError(500))).toContain('No se pudieron guardar');
    expect(lotError(new Error())).toContain('No se pudo completar');
  });
});

describe('Expiry status', () => {
  const today = new Date('2026-11-02T12:00:00.000Z');

  it.each([
    ['2026-11-01', 'Caducado', 'expired'],
    ['2026-11-02', 'Caduca hoy', 'soon'],
    ['2026-11-03', 'Caduca en 1 día', 'soon'],
    ['2026-11-09', 'Caduca en 7 días', 'soon'],
    ['2026-11-10', 'Caduca en 8 días', 'upcoming'],
    ['2026-12-02', 'Caduca en 30 días', 'upcoming'],
    ['2026-12-03', 'Caduca en más de 30 días', 'later'],
  ])('describes %s as %s', (date, label, tone) => {
    expect(expiryStatus(date, today)).toEqual({ label, tone });
  });

  it('does not invent a status for an unreadable date', () => {
    expect(expiryStatus('', today)).toEqual({ label: 'Fecha sin revisar', tone: 'later' });
  });
});
