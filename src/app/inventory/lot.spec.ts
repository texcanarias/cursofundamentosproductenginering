import { HttpErrorResponse } from '@angular/common/http';
import { FormControl } from '@angular/forms';
import { calendarDate, expiryLabel, isCalendarDate, lotError, requiredText } from './lot';

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
    expect(lotError(new HttpErrorResponse({ status: 0 }))).toContain('No hay conexión');
    expect(lotError(new HttpErrorResponse({ status: 404 }))).toContain('ya no está disponible');
    expect(
      lotError(
        new HttpErrorResponse({ status: 400, error: { error: { mensaje: 'Fecha inválida' } } }),
      ),
    ).toBe('Fecha inválida');
    expect(lotError(new Error())).toContain('No se pudo completar');
  });
});
