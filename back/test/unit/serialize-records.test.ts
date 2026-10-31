import { describe, expect, it } from 'vitest';
import { serializeRecords } from '../../src/infrastructure/csv/serialize-records.js';

describe('serializeRecords', () => {
  it('escapes separators, quotes and preserves accents', () => {
    const records = [{ name: 'Familia, "Norte"', note: 'Entrega rápida' }];

    expect(serializeRecords(records)).toBe('name,note\n"Familia, ""Norte""",Entrega rápida\n');
  });
});
