import { firstValueFrom } from 'rxjs';
import { describe, expect, it } from 'vitest';
import { BrowserRepository } from './browser-repository';

interface Record {
  id: string;
  nombre: string;
}

const KEY = 'a-la-par:repository-test';
const data = { nombre: 'Arroz' };

function repository(): BrowserRepository<Record, typeof data> {
  return new BrowserRepository<Record, typeof data>(KEY, 'record');
}

describe('Browser repository', () => {
  it('creates, lists and retrieves records from local storage', async () => {
    localStorage.clear();
    const repo = repository();
    const created = await firstValueFrom(repo.create(data));
    expect(created.id).toMatch(/^record-/);
    expect(await firstValueFrom(repo.list())).toEqual([created]);
    expect(await firstValueFrom(repo.get(created.id))).toEqual(created);
  });

  it('updates only the selected record', async () => {
    localStorage.clear();
    const repo = repository();
    const first = await firstValueFrom(repo.create(data));
    const second = await firstValueFrom(repo.create({ nombre: 'Lentejas' }));
    const updated = await firstValueFrom(repo.update(first.id, { nombre: 'Arroz integral' }));
    expect(updated).toEqual({ ...first, nombre: 'Arroz integral' });
    expect(await firstValueFrom(repo.list())).toEqual([updated, second]);
  });

  it('deletes only the selected record', async () => {
    localStorage.clear();
    const repo = repository();
    const first = await firstValueFrom(repo.create(data));
    const second = await firstValueFrom(repo.create({ nombre: 'Lentejas' }));
    await firstValueFrom(repo.delete(first.id));
    expect(await firstValueFrom(repo.list())).toEqual([second]);
  });

  it('reports a missing record with status 404', async () => {
    localStorage.clear();
    const repo = repository();
    await expect(firstValueFrom(repo.get('missing'))).rejects.toMatchObject({ status: 404 });
    await expect(firstValueFrom(repo.update('missing', data))).rejects.toMatchObject({
      status: 404,
    });
    await expect(firstValueFrom(repo.delete('missing'))).rejects.toMatchObject({ status: 404 });
  });

  it('reports unreadable data with status 0', async () => {
    localStorage.setItem(KEY, '{invalid');
    await expect(firstValueFrom(repository().list())).rejects.toMatchObject({ status: 0 });
  });
});
