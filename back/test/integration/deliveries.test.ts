import { mkdtemp, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import request from 'supertest';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import type { CsvRecordStore } from '../../src/application/ports/csv-record-store.js';
import { CsvFileStore } from '../../src/infrastructure/csv/csv-file-store.js';
import { createApp } from '../../src/infrastructure/http/create-app.js';

const data = { familiaId: 'FAM-001', fecha: '2026-10-31' };
let directory: string;
let path: string;
let app: ReturnType<typeof createApp>;

beforeEach(async () => {
  directory = await mkdtemp(join(tmpdir(), 'deliveries-'));
  path = join(directory, 'entregas.csv');
  app = buildApp();
});

afterEach(async () => {
  await rm(directory, { recursive: true, force: true });
});

function buildApp(
  deliveryStore: CsvRecordStore = new CsvFileStore(path),
): ReturnType<typeof createApp> {
  return createApp(new CsvFileStore(join(directory, 'lotes.csv')), deliveryStore);
}

describe('CRUD HTTP and CSV acceptance scenarios (spec 005)', () => {
  it('returns an empty list before any delivery is registered', async () => {
    const response = await request(app).get('/api/entregas');
    expect(response.status).toBe(200);
    expect(response.body).toEqual([]);
  });

  it('registers a delivery and returns its generated identifier and exact date', async () => {
    const response = await request(app)
      .post('/api/entregas')
      .send({ ...data, id: 'client-id' });
    expect(response.status).toBe(201);
    expect(response.body).toEqual({ id: expect.any(String), ...data, observacion: '' });
    expect(response.body.id).not.toBe('client-id');
    expect(response.body.fecha).toBe('2026-10-31');
    expect(await new CsvFileStore(path).readAll()).toEqual([response.body]);
    const detail = await request(app).get(`/api/entregas/${response.body.id}`);
    expect(detail.status).toBe(200);
    expect(detail.body).toEqual(response.body);
  });

  it('registers and returns the optional observation', async () => {
    const observacion = 'Entrega completa';
    const response = await request(app)
      .post('/api/entregas')
      .send({ ...data, observacion });
    expect(response.status).toBe(201);
    expect(response.body.observacion).toBe(observacion);
    expect((await request(app).get('/api/entregas')).body[0].observacion).toBe(observacion);
  });

  it('lists every delivery with its four fields and keeps duplicates independent', async () => {
    const first = await request(app).post('/api/entregas').send(data);
    const second = await request(app).post('/api/entregas').send(data);
    const other = await request(app)
      .post('/api/entregas')
      .send({ familiaId: 'FAM-002', fecha: '2026-01-15' });
    const response = await request(app).get('/api/entregas');
    expect(response.status).toBe(200);
    expect(response.body).toEqual([first.body, second.body, other.body]);
    expect(new Set(response.body.map((entry: { id: string }) => entry.id)).size).toBe(3);
    for (const entry of response.body) {
      expect(Object.keys(entry).sort()).toEqual(['familiaId', 'fecha', 'id', 'observacion']);
    }
  });

  it('deletes only the selected delivery and leaves no body', async () => {
    const first = await request(app).post('/api/entregas').send(data);
    const second = await request(app).post('/api/entregas').send(data);
    const deleted = await request(app).delete(`/api/entregas/${first.body.id}`);
    expect(deleted.status).toBe(204);
    expect(deleted.text).toBe('');
    expect(await new CsvFileStore(path).readAll()).toEqual([second.body]);
    expect((await request(app).get('/api/entregas')).body).toEqual([second.body]);
    expect((await request(app).get(`/api/entregas/${first.body.id}`)).status).toBe(404);
  });

  it('accepts a past date and stores it exactly', async () => {
    const response = await request(app)
      .post('/api/entregas')
      .send({ ...data, fecha: '2026-01-15' });
    expect(response.status).toBe(201);
    expect(response.body.fecha).toBe('2026-01-15');
    expect(await new CsvFileStore(path).readAll()).toEqual([response.body]);
  });

  it.each(['get', 'delete'] as const)(
    'returns JSON 404 for missing deliveries: %s',
    async (method) => {
      const created = await request(app).post('/api/entregas').send(data);
      const response = await request(app)[method]('/api/entregas/missing');
      expect(response.status).toBe(404);
      expect(response.body.error).toEqual({ codigo: 'NO_ENCONTRADO', mensaje: expect.any(String) });
      expect((await request(app).get('/api/entregas')).body).toEqual([created.body]);
    },
  );

  it('keeps deliveries after the server restarts', async () => {
    const created = await request(app).post('/api/entregas').send(data);
    app = buildApp();
    expect((await request(app).get('/api/entregas')).body).toEqual([created.body]);
  });

  it('preserves special characters in the identifier in the response and the CSV', async () => {
    const familiaId = 'FAM-ÁÉÍÓÚ/&';
    const response = await request(app)
      .post('/api/entregas')
      .send({ ...data, familiaId });
    expect(response.status).toBe(201);
    expect(response.body.familiaId).toBe(familiaId);
    expect(await readFile(path, 'utf8')).toContain(familiaId);
    app = buildApp();
    expect((await request(app).get(`/api/entregas/${response.body.id}`)).body.familiaId).toBe(
      familiaId,
    );
  });

  it('round-trips CSV commas, quotes and newlines in the observation', async () => {
    const observacion = 'Sin incidencias, "gracias"\nsegunda linea';
    const response = await request(app)
      .post('/api/entregas')
      .send({ ...data, observacion });
    expect(response.status).toBe(201);
    app = buildApp();
    expect((await request(app).get(`/api/entregas/${response.body.id}`)).body).toEqual(
      response.body,
    );
  });

  it('rejects malformed JSON without registering a delivery', async () => {
    const response = await request(app)
      .post('/api/entregas')
      .set('Content-Type', 'application/json')
      .send('{');
    expect(response.status).toBe(400);
    expect(response.body.error.codigo).toBe('JSON_INVALIDO');
    expect((await request(app).get('/api/entregas')).body).toEqual([]);
  });

  it('does not lose concurrent writes in the same backend instance', async () => {
    const responses = await Promise.all(
      Array.from({ length: 10 }, () => request(app).post('/api/entregas').send(data)),
    );
    expect(responses.every((response) => response.status === 201)).toBe(true);
    const persisted = await new CsvFileStore(path).readAll();
    expect(persisted).toHaveLength(10);
    expect(new Set(persisted.map((entry) => entry.id)).size).toBe(10);
  });

  it('does not expose success when the CSV cannot be written', async () => {
    const created = await request(app).post('/api/entregas').send(data);
    const before = await readFile(path, 'utf8');
    const blockedStore = new CsvFileStore(join(path, 'cannot-write.csv'));
    const broken = buildApp({
      readAll: () => new CsvFileStore(path).readAll(),
      writeAll: (rows) => blockedStore.writeAll(rows),
    });
    const responses = [
      await request(broken).post('/api/entregas').send(data),
      await request(broken).delete(`/api/entregas/${created.body.id}`),
    ];
    for (const response of responses) {
      expect(response.status).toBe(500);
      expect(response.body.error).toEqual({ codigo: 'ERROR_INTERNO', mensaje: expect.any(String) });
    }
    expect(await readFile(path, 'utf8')).toBe(before);
  });
});
