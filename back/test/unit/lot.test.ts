import { describe, expect, it } from 'vitest';
import { LotValidationError, validateLot } from '../../src/domain/lot.js';

const valid = { nombreProducto: 'Arroz', caducidad: '2027-03-15', ubicacion: 'Almacen A' };

describe('Lot validation', () => {
  it('preserves all editable fields and ignores client identifiers', () => {
    expect(validateLot({ ...valid, id: 'client-id' })).toEqual(valid);
  });

  it.each(['2000-02-29', '2024-02-29', '1999-01-01', '2027-03-15'])(
    'accepts real dates including past dates: %s',
    (caducidad) => expect(validateLot({ ...valid, caducidad }).caducidad).toBe(caducidad),
  );

  it.each([
    '2027-02-30',
    '2027-02-29',
    '1900-02-29',
    '2027-04-31',
    '2027-13-01',
    '2027-00-01',
    '2027-01-00',
    '0000-01-01',
    '15/03/2027',
    '2027-3-15',
    '2027-03-15T00:00:00Z',
    ' 2027-03-15 ',
  ])('rejects invalid calendar dates: %s', (caducidad) => {
    expect(() => validateLot({ ...valid, caducidad })).toThrow(LotValidationError);
  });

  it.each(['nombreProducto', 'caducidad', 'ubicacion'] as const)(
    'rejects missing, blank and non-text values for %s',
    (campo) => {
      for (const value of [undefined, null, '', '   ', 123, true, [], {}]) {
        try {
          validateLot({ ...valid, [campo]: value });
          expect.fail('Expected a validation error');
        } catch (error) {
          expect(error).toBeInstanceOf(LotValidationError);
          expect((error as LotValidationError).campo).toBe(campo);
        }
      }
    },
  );

  it.each([undefined, null, [], 'invalid', 42])('rejects non-object bodies: %s', (body) => {
    expect(() => validateLot(body)).toThrow(LotValidationError);
  });
});
