import { TestBed } from '@angular/core/testing';
import { firstValueFrom } from 'rxjs';
import { describe, expect, it, vi } from 'vitest';
import { LotApi } from './lot-api';

const KEY = 'a-la-par:lotes';
const data = { nombreProducto: 'Arroz', caducidad: '2027-03-15', ubicacion: 'Almacén A' };
let api: LotApi;

beforeEach(() => {
  localStorage.clear();
  TestBed.configureTestingModule({});
  api = TestBed.inject(LotApi);
});

afterEach(() => vi.restoreAllMocks());

describe('Lot browser persistence', () => {
  it('creates and lists lots under the inventory key', async () => {
    const lot = await firstValueFrom(api.create(data));
    expect(lot.id).toMatch(/^lot-/);
    expect(JSON.parse(localStorage.getItem(KEY) ?? '[]')).toEqual([lot]);
    expect(await firstValueFrom(api.list())).toEqual([lot]);
  });

  it('gets, updates and deletes by identifier', async () => {
    const lot = { id: 'one', ...data };
    const other = { id: 'two', ...data, ubicacion: 'Almacén B' };
    localStorage.setItem(KEY, JSON.stringify([lot, other]));

    expect(await firstValueFrom(api.get('one'))).toEqual(lot);
    const updated = await firstValueFrom(api.update('one', { ...data, ubicacion: 'Almacén C' }));
    expect(updated).toEqual({ id: 'one', ...data, ubicacion: 'Almacén C' });
    await firstValueFrom(api.delete('one'));
    expect(await firstValueFrom(api.list())).toEqual([other]);
  });

  it('reports a missing lot with status 404', async () => {
    await expect(firstValueFrom(api.get('missing'))).rejects.toMatchObject({ status: 404 });
  });

  it('reports corrupt data and failed writes without losing saved records', async () => {
    localStorage.setItem(KEY, '{invalid');
    await expect(firstValueFrom(api.list())).rejects.toMatchObject({ status: 0 });

    localStorage.setItem(KEY, '[]');
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('quota');
    });
    await expect(firstValueFrom(api.create(data))).rejects.toMatchObject({ status: 500 });
    expect(localStorage.getItem(KEY)).toBe('[]');
  });
});
