import { FormControl } from '@angular/forms';
import { LocalStorageError } from '../shared/browser-storage';
import { NotFoundError } from '../shared/browser-repository';
import {
  calendarDate,
  deliveryDateLabel,
  deliveryError,
  isCalendarDate,
  requiredText,
} from './delivery';

describe('Delivery dates and validation', () => {
  it.each(['2024-02-29', '2000-02-29', '2026-01-15', '2026-10-31'])(
    'accepts real calendar dates including past dates: %s',
    (value) => expect(isCalendarDate(value)).toBe(true),
  );

  it.each([
    '31-10-2026',
    '2026-13-01',
    '2026-02-30',
    '2026-02-29',
    '2026-10-31T00:00:00Z',
    ' 2026-10-31 ',
    '',
    '0000-01-01',
  ])('rejects invalid date %s', (value) => {
    expect(calendarDate(new FormControl(value))).toEqual({ date: true });
  });

  it.each(['', '   ', null, 123])('rejects empty or non-text family identifiers: %s', (value) => {
    expect(requiredText(new FormControl(value))).toEqual({ required: true });
  });

  it('formats the delivery day without timezone shifts', () => {
    expect(deliveryDateLabel('2026-01-15')).toBe('15 de enero de 2026');
    expect(deliveryDateLabel('2026-10-31')).toBe('31 de octubre de 2026');
  });

  it('provides actionable error messages without claiming success', () => {
    expect(deliveryError(new LocalStorageError(0))).toContain('No se pudieron leer');
    expect(deliveryError(new NotFoundError())).toContain('entrega ya no está disponible');
    expect(deliveryError(new LocalStorageError(500))).toContain('No se pudieron guardar');
    expect(deliveryError(new Error())).toContain('No se pudo completar');
  });
});
