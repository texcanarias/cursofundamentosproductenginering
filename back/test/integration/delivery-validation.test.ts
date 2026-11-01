import { mkdtemp, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import request from 'supertest';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { CsvFileStore } from '../../src/infrastructure/csv/csv-file-store.js';
import { createApp } from '../../src/infrastructure/http/create-app.js';

const data = { familiaId: 'FAM-001', fecha: '2026-10-31' };
const invalidText = [undefined, null, '', '   ', 123, true, [], {}];
const invalidDates = [
  '31-10-2026',
  '2026-13-01',
  '2026-02-30',
  '2026-02-29',
  '2026-00-01',
  '2026-10-31T00:00:00Z',
  ' 2026-10-31 ',
];
const cases = [
  ...invalidText.map((value) => ({ campo: 'familiaId', value })),
  ...invalidText.map((value) => ({ campo: 'fecha', value })),
  ...invalidDates.map((value) => ({ campo: 'fecha', value })),
  ...[123, true, [], {}].map((value) => ({ campo: 'observacion', value })),
];
let directory: string;
let path: string;
let store: CsvFileStore;
let app: ReturnType<typeof createApp>;

beforeEach(async () => {
  directory = await mkdtemp(join(tmpdir(), 'delivery-validation-'));
  path = join(directory, 'entregas.csv');
  store = new CsvFileStore(path);
  app = createApp(new CsvFileStore(join(directory, 'lotes.csv')), store);
});

afterEach(async () => {
  vi.restoreAllMocks();
  await rm(directory, { recursive: true, force: true });
});

describe('HTTP validation of deliveries (spec 005)', () => {
  it.each(cases)('rejects $campo=$value without changing the CSV', async ({ campo, value }) => {
    const created = await request(app).post('/api/entregas').send(data);
    const before = await readFile(path, 'utf8');
    const response = await request(app)
      .post('/api/entregas')
      .send({ ...data, [campo]: value });
    expect(response.status).toBe(400);
    expect(response.body.error).toEqual({
      codigo: 'VALIDACION',
      campo,
      mensaje: expect.any(String),
    });
    expect(await readFile(path, 'utf8')).toBe(before);
    expect((await request(app).get('/api/entregas')).body).toEqual([created.body]);
  });

  it.each([undefined, null, '', '   '])(
    'accepts an absent or blank observation: %s',
    async (observacion) => {
      const response = await request(app)
        .post('/api/entregas')
        .send({ ...data, observacion });
      expect(response.status).toBe(201);
      expect(response.body.observacion).toBe(observacion === '   ' ? '   ' : '');
    },
  );

  it.each([null, [], 'invalid', 42])('rejects invalid JSON body shapes: %s', async (body) => {
    const response = await request(app)
      .post('/api/entregas')
      .set('Content-Type', 'application/json')
      .send(JSON.stringify(body));
    expect(response.status).toBe(400);
    expect(response.body.error.codigo).toMatch(/VALIDACION|JSON_INVALIDO/);
    expect((await request(app).get('/api/entregas')).body).toEqual([]);
  });
});

describe('Persistence error recovery for deliveries', () => {
  it('does not expose read errors or filesystem details', async () => {
    vi.spyOn(store, 'readAll').mockRejectedValueOnce(new Error('/private/storage/path'));
    const response = await request(app).get('/api/entregas');
    expect(response.status).toBe(500);
    expect(response.body.error.codigo).toBe('ERROR_INTERNO');
    expect(response.text).not.toContain('/private/storage/path');
  });

  it('accepts a new write after a previous write failed', async () => {
    vi.spyOn(store, 'writeAll').mockRejectedValueOnce(new Error('Cannot write'));
    expect((await request(app).post('/api/entregas').send(data)).status).toBe(500);
    const response = await request(app).post('/api/entregas').send(data);
    expect(response.status).toBe(201);
    expect(await store.readAll()).toEqual([response.body]);
  });

  it('returns 404 instead of 500 when deleting a missing delivery', async () => {
    const response = await request(app).delete('/api/entregas/missing');
    expect(response.status).toBe(404);
    expect(response.body.error.codigo).toBe('NO_ENCONTRADO');
  });
});
