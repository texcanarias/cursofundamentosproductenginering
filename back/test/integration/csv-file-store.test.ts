import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import { CsvFileStore } from '../../src/infrastructure/csv/csv-file-store.js';

let temporaryDirectory = '';

afterEach(async () => {
  if (temporaryDirectory) await rm(temporaryDirectory, { recursive: true, force: true });
});

describe('CsvFileStore', () => {
  it('round-trips CSV records and creates missing directories', async () => {
    temporaryDirectory = await mkdtemp(join(tmpdir(), 'csv-store-'));
    const store = new CsvFileStore(join(temporaryDirectory, 'nested', 'records.csv'));
    const records = [{ name: 'Familia, "Norte"', note: 'Entrega rápida' }];

    await store.writeAll(records);

    await expect(store.readAll()).resolves.toEqual(records);
  });

  it('returns an empty list when the file does not exist', async () => {
    temporaryDirectory = await mkdtemp(join(tmpdir(), 'csv-store-'));
    const store = new CsvFileStore(join(temporaryDirectory, 'missing.csv'));

    await expect(store.readAll()).resolves.toEqual([]);
  });
});
