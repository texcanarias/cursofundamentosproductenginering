import { HttpErrorResponse } from '@angular/common/http';
import { FormControl } from '@angular/forms';
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
    expect(deliveryError(new HttpErrorResponse({ status: 0 }))).toContain('No hay conexión');
    expect(deliveryError(new HttpErrorResponse({ status: 404 }))).toContain(
      'entrega ya no está disponible',
    );
    expect(
      deliveryError(
        new HttpErrorResponse({ status: 400, error: { error: { mensaje: 'Fecha inválida' } } }),
      ),
    ).toBe('Fecha inválida');
    expect(deliveryError(new Error())).toContain('No se pudo completar');
  });
});
