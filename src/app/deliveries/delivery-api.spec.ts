import { TestBed } from '@angular/core/testing';
import { firstValueFrom } from 'rxjs';
import { describe, expect, it, vi } from 'vitest';
import { DeliveryApi } from './delivery-api';

const KEY = 'a-la-par:entregas';
const data = { familiaId: 'FAM-001', fecha: '2026-10-31', observacion: 'Entrega completa' };
let api: DeliveryApi;

beforeEach(() => {
  localStorage.clear();
  TestBed.configureTestingModule({});
  api = TestBed.inject(DeliveryApi);
});

afterEach(() => vi.restoreAllMocks());

describe('Delivery browser persistence', () => {
  it('creates and lists deliveries under the deliveries key', async () => {
    const delivery = await firstValueFrom(api.create(data));
    expect(delivery.id).toMatch(/^delivery-/);
    expect(JSON.parse(localStorage.getItem(KEY) ?? '[]')).toEqual([delivery]);
    expect(await firstValueFrom(api.list())).toEqual([delivery]);
  });

  it('gets and deletes by identifier without touching other deliveries', async () => {
    const delivery = { id: 'one', ...data };
    const other = { id: 'two', ...data, familiaId: 'FAM-002' };
    localStorage.setItem(KEY, JSON.stringify([delivery, other]));

    expect(await firstValueFrom(api.get('one'))).toEqual(delivery);
    await firstValueFrom(api.delete('one'));
    expect(await firstValueFrom(api.list())).toEqual([other]);
  });

  it('reports a missing delivery with status 404', async () => {
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
