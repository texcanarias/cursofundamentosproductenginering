import { mkdtemp, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import request from 'supertest';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { CsvFileStore } from '../../src/infrastructure/csv/csv-file-store.js';
import { createApp } from '../../src/infrastructure/http/create-app.js';

const data = { nombreProducto: 'Arroz', caducidad: '2027-03-15', ubicacion: 'Almacen A' };
let directory: string;
let path: string;
let app: ReturnType<typeof createApp>;

beforeEach(async () => {
  directory = await mkdtemp(join(tmpdir(), 'lots-'));
  path = join(directory, 'lotes.csv');
  app = createApp(new CsvFileStore(path));
});

afterEach(async () => {
  await rm(directory, { recursive: true, force: true });
});

describe('CRUD HTTP and CSV acceptance scenarios (spec 002)', () => {
  it('returns an empty inventory before any lot is created', async () => {
    const response = await request(app).get('/api/lotes');
    expect(response.status).toBe(200);
    expect(response.body).toEqual([]);
  });

  it('creates, persists and retrieves a lot with its generated identifier', async () => {
    const response = await request(app)
      .post('/api/lotes')
      .send({ ...data, id: 'client-id' });
    expect(response.status).toBe(201);
    expect(response.body).toEqual({ id: expect.any(String), ...data });
    expect(response.body.id).not.toBe('client-id');
    expect(await new CsvFileStore(path).readAll()).toEqual([response.body]);
    const detail = await request(app).get(`/api/lotes/${response.body.id}`);
    expect(detail.status).toBe(200);
    expect(detail.body).toEqual(response.body);
  });

  it('keeps distinct dates, locations and identical lots without overwriting', async () => {
    const first = await request(app).post('/api/lotes').send(data);
    const second = await request(app)
      .post('/api/lotes')
      .send({
        ...data,
        caducidad: '2027-06-20',
        ubicacion: 'Almacen B',
      });
    const duplicate = await request(app).post('/api/lotes').send(data);
    const response = await request(app).get('/api/lotes');
    expect(response.status).toBe(200);
    expect(response.body).toEqual([first.body, second.body, duplicate.body]);
    expect(new Set(response.body.map((lot: { id: string }) => lot.id)).size).toBe(3);
  });

  it('updates and deletes only the selected lot and survives a restart', async () => {
    const first = await request(app).post('/api/lotes').send(data);
    const second = await request(app).post('/api/lotes').send(data);
    const changed = { nombreProducto: 'Arroz integral', caducidad: '2027-07-01', ubicacion: 'C' };
    const update = await request(app).put(`/api/lotes/${first.body.id}`).send(changed);
    expect(update.status).toBe(200);
    expect(update.body).toEqual({ id: first.body.id, ...changed });
    app = createApp(new CsvFileStore(path));
    expect((await request(app).get('/api/lotes')).body).toEqual([update.body, second.body]);
    const deleted = await request(app).delete(`/api/lotes/${second.body.id}`);
    expect(deleted.status).toBe(204);
    expect(deleted.text).toBe('');
    expect(await new CsvFileStore(path).readAll()).toEqual([update.body]);
    app = createApp(new CsvFileStore(path));
    expect((await request(app).get('/api/lotes')).body).toEqual([update.body]);
    expect((await request(app).get(`/api/lotes/${second.body.id}`)).status).toBe(404);
  });

  it('persists an empty inventory after deleting the last lot', async () => {
    const created = await request(app).post('/api/lotes').send(data);
    expect((await request(app).delete(`/api/lotes/${created.body.id}`)).status).toBe(204);
    app = createApp(new CsvFileStore(path));
    expect((await request(app).get('/api/lotes')).body).toEqual([]);
  });

  it('round-trips CSV commas, quotes, accents and newlines', async () => {
    const special = {
      ...data,
      nombreProducto: 'Arroz, intégral',
      ubicacion: 'Estante "A", sección 2\nbalda 3',
    };
    const created = await request(app).post('/api/lotes').send(special);
    expect(created.status).toBe(201);
    app = createApp(new CsvFileStore(path));
    expect((await request(app).get(`/api/lotes/${created.body.id}`)).body).toEqual(created.body);
    expect((await request(app).get('/api/lotes')).body).toEqual([created.body]);
  });

  it('creates and updates expired lots without changing their date', async () => {
    const expired = { ...data, caducidad: '1999-01-01' };
    const created = await request(app).post('/api/lotes').send(expired);
    expect(created.status).toBe(201);
    const updated = await request(app).put(`/api/lotes/${created.body.id}`).send(expired);
    expect(updated.status).toBe(200);
    expect((await request(app).get(`/api/lotes/${created.body.id}`)).body.caducidad).toBe(
      '1999-01-01',
    );
  });

  it.each(['get', 'put', 'delete'] as const)(
    'returns JSON 404 for missing lots: %s',
    async (method) => {
      const created = await request(app).post('/api/lotes').send(data);
      const response = await request(app)[method]('/api/lotes/missing').send(data);
      expect(response.status).toBe(404);
      expect(response.body.error).toEqual({ codigo: 'NO_ENCONTRADO', mensaje: expect.any(String) });
      expect((await request(app).get('/api/lotes')).body).toEqual([created.body]);
    },
  );

  it('rejects malformed JSON without modifying the inventory', async () => {
    const response = await request(app)
      .post('/api/lotes')
      .set('Content-Type', 'application/json')
      .send('{');
    expect(response.status).toBe(400);
    expect(response.body.error.codigo).toBe('JSON_INVALIDO');
    expect((await request(app).get('/api/lotes')).body).toEqual([]);
  });

  it('does not lose concurrent writes in the same backend instance', async () => {
    const responses = await Promise.all(
      Array.from({ length: 10 }, () => request(app).post('/api/lotes').send(data)),
    );
    expect(responses.every((response) => response.status === 201)).toBe(true);
    const persisted = await new CsvFileStore(path).readAll();
    expect(persisted).toHaveLength(10);
    expect(new Set(persisted.map((lot) => lot.id)).size).toBe(10);
  });

  it('does not expose success when the CSV cannot be written', async () => {
    const created = await request(app).post('/api/lotes').send(data);
    const before = await readFile(path, 'utf8');
    const blockedStore = new CsvFileStore(join(path, 'cannot-write.csv'));
    const broken = createApp({
      readAll: () => new CsvFileStore(path).readAll(),
      writeAll: (rows) => blockedStore.writeAll(rows),
    });
    const responses = [
      await request(broken).post('/api/lotes').send(data),
      await request(broken).put(`/api/lotes/${created.body.id}`).send(data),
      await request(broken).delete(`/api/lotes/${created.body.id}`),
    ];
    for (const response of responses) {
      expect(response.status).toBe(500);
      expect(response.body.error).toEqual({ codigo: 'ERROR_INTERNO', mensaje: expect.any(String) });
    }
    expect(await readFile(path, 'utf8')).toBe(before);
  });
});
