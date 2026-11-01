import { describe, expect, it } from 'vitest';
import { DeliveryValidationError, validateDelivery } from '../../src/domain/delivery.js';

const valid = { familiaId: 'FAM-001', fecha: '2026-10-31' };

describe('Delivery validation', () => {
  it('preserves the editable fields and ignores client identifiers', () => {
    expect(validateDelivery({ ...valid, id: 'client-id' })).toEqual({
      ...valid,
      observacion: '',
    });
  });

  it.each(['2000-02-29', '2024-02-29', '2026-01-15', '2026-10-31'])(
    'accepts real dates including past dates: %s',
    (fecha) => expect(validateDelivery({ ...valid, fecha }).fecha).toBe(fecha),
  );

  it.each([
    '31-10-2026',
    '2026-13-01',
    '2026-02-30',
    '2026-02-29',
    '2026-00-01',
    '2026-01-00',
    '0000-01-01',
    '2026-1-05',
    '2026-10-31T00:00:00Z',
    ' 2026-10-31 ',
  ])('rejects invalid calendar dates: %s', (fecha) => {
    expect(() => validateDelivery({ ...valid, fecha })).toThrow(DeliveryValidationError);
  });

  it.each(['familiaId', 'fecha'] as const)(
    'rejects missing, blank and non-text values for %s',
    (campo) => {
      for (const value of [undefined, null, '', '   ', 123, true, [], {}]) {
        expectValidationError({ ...valid, [campo]: value }, campo);
      }
    },
  );

  it('keeps the optional observation as an empty string when it is absent', () => {
    expect(validateDelivery({ ...valid }).observacion).toBe('');
    expect(validateDelivery({ ...valid, observacion: null }).observacion).toBe('');
    expect(validateDelivery({ ...valid, observacion: '' }).observacion).toBe('');
  });

  it('preserves the observation exactly as received', () => {
    const observacion = 'Entrega completa, "sin" incidencias';
    expect(validateDelivery({ ...valid, observacion }).observacion).toBe(observacion);
  });

  it.each([123, true, [], {}])('rejects non-text observations: %s', (observacion) => {
    expectValidationError({ ...valid, observacion }, 'observacion');
  });

  it.each([undefined, null, [], 'invalid', 42])('rejects non-object bodies: %s', (body) => {
    expect(() => validateDelivery(body)).toThrow(DeliveryValidationError);
  });
});

function expectValidationError(input: unknown, campo: string): void {
  try {
    validateDelivery(input);
    expect.fail('Expected a validation error');
  } catch (error) {
    expect(error).toBeInstanceOf(DeliveryValidationError);
    expect((error as DeliveryValidationError).campo).toBe(campo);
  }
}
