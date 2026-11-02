import { describe, expect, it, vi } from 'vitest';
import { LocalStorageError, nextId, readList, writeList } from './browser-storage';

const KEY = 'a-la-par:test';

describe('Browser storage', () => {
  it('returns an empty list when there is no saved data', () => {
    localStorage.clear();
    expect(readList(KEY)).toEqual([]);
  });

  it('round-trips records as JSON', () => {
    const records = [{ id: 'one', nombre: 'Arroz' }];
    writeList(KEY, records);
    expect(readList(KEY)).toEqual(records);
  });

  it('reports unreadable data instead of silently returning an empty list', () => {
    localStorage.setItem(KEY, '{invalid');
    expect(() => readList(KEY)).toThrow(LocalStorageError);
    expect(localStorage.getItem(KEY)).toBe('{invalid');
  });

  it('reports write failures so the caller never confirms a lost change', () => {
    const spy = vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('quota');
    });
    expect(() => writeList(KEY, [{ id: 'one' }])).toThrow(LocalStorageError);
    spy.mockRestore();
  });

  it('generates unique identifiers with the requested prefix', () => {
    expect(nextId('lot')).toMatch(/^lot-/);
    expect(nextId('lot')).not.toBe(nextId('lot'));
  });
});
