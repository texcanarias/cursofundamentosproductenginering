import { mkdtemp, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import request from 'supertest';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { CsvFileStore } from '../../src/infrastructure/csv/csv-file-store.js';
import { createApp } from '../../src/infrastructure/http/create-app.js';

const data = { nombreProducto: 'Arroz', caducidad: '2027-03-15', ubicacion: 'Almacen A' };
const fields = ['nombreProducto', 'caducidad', 'ubicacion'] as const;
const invalidFields = fields.flatMap((campo) =>
  [undefined, null, '', '   ', 123, true, [], {}].map((value) => ({ campo, value })),
);
const invalidDates = ['15/03/2027', '2027-02-30', '2027-02-29', '2027-03-15T00:00:00Z'];
const cases = [...invalidFields, ...invalidDates.map((value) => ({ campo: 'caducidad', value }))];
let directory: string;
let path: string;
let store: CsvFileStore;
let app: ReturnType<typeof createApp>;

beforeEach(async () => {
  directory = await mkdtemp(join(tmpdir(), 'lot-validation-'));
  path = join(directory, 'lotes.csv');
  store = new CsvFileStore(path);
  app = createApp(store);
});

afterEach(async () => {
  vi.restoreAllMocks();
  await rm(directory, { recursive: true, force: true });
});

describe.each(['post', 'put'] as const)('HTTP validation: %s', (method) => {
  it.each(cases)('rejects $campo=$value without changing the CSV', async ({ campo, value }) => {
    const created = await request(app).post('/api/lotes').send(data);
    const before = await readFile(path, 'utf8');
    const url = method === 'post' ? '/api/lotes' : `/api/lotes/${created.body.id}`;
    const response = await request(app)
      [method](url)
      .send({ ...data, [campo]: value });
    expect(response.status).toBe(400);
    expect(response.body.error).toEqual({
      codigo: 'VALIDACION',
      campo,
      mensaje: expect.any(String),
    });
    expect(await readFile(path, 'utf8')).toBe(before);
    expect((await request(app).get('/api/lotes')).body).toEqual([created.body]);
  });

  it.each([null, [], 'invalid', 42])('rejects invalid JSON body shapes: %s', async (body) => {
    const url = method === 'post' ? '/api/lotes' : '/api/lotes/missing';
    const response = await request(app)
      [method](url)
      .set('Content-Type', 'application/json')
      .send(JSON.stringify(body));
    expect(response.status).toBe(400);
    expect(response.body.error.codigo).toMatch(/VALIDACION|JSON_INVALIDO/);
    expect((await request(app).get('/api/lotes')).body).toEqual([]);
  });
});

describe('Persistence error recovery', () => {
  it('does not expose read errors or filesystem details', async () => {
    vi.spyOn(store, 'readAll').mockRejectedValueOnce(new Error('/private/storage/path'));
    const response = await request(app).get('/api/lotes');
    expect(response.status).toBe(500);
    expect(response.body.error.codigo).toBe('ERROR_INTERNO');
    expect(response.text).not.toContain('/private/storage/path');
  });

  it('accepts a new write after a previous write failed', async () => {
    vi.spyOn(store, 'writeAll').mockRejectedValueOnce(new Error('Cannot write'));
    expect((await request(app).post('/api/lotes').send(data)).status).toBe(500);
    const response = await request(app).post('/api/lotes').send(data);
    expect(response.status).toBe(201);
    expect(await store.readAll()).toEqual([response.body]);
  });
});
