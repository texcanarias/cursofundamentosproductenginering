import { beforeEach, describe, expect, it, vi } from 'vitest';
import { LotService } from '../../src/application/lot-service.js';
import { LotNotFoundError, LotValidationError } from '../../src/domain/lot.js';

const data = { nombreProducto: 'Arroz', caducidad: '2027-03-15', ubicacion: 'Almacen A' };
const lot = { id: 'generated-id', ...data };
const repository = {
  list: vi.fn(),
  insert: vi.fn(),
  replace: vi.fn(),
  delete: vi.fn(),
};
const service = new LotService(repository, () => lot.id);

beforeEach(() => {
  vi.resetAllMocks();
  repository.list.mockResolvedValue([lot]);
});

describe('Lot use cases', () => {
  it('lists lots and retrieves a lot by identifier', async () => {
    await expect(service.list()).resolves.toEqual([lot]);
    await expect(service.get(lot.id)).resolves.toEqual(lot);
    await expect(service.get('missing')).rejects.toBeInstanceOf(LotNotFoundError);
  });

  it('creates a lot with a server-generated identifier', async () => {
    await expect(service.create({ ...data, id: 'untrusted' })).resolves.toEqual(lot);
    expect(repository.insert).toHaveBeenCalledWith(lot);
  });

  it('replaces all editable fields while retaining the path identifier', async () => {
    await expect(service.update(lot.id, { ...data, id: 'untrusted' })).resolves.toEqual(lot);
    expect(repository.replace).toHaveBeenCalledWith(lot);
  });

  it('deletes only the requested identifier', async () => {
    await service.delete(lot.id);
    expect(repository.delete).toHaveBeenCalledWith(lot.id);
  });

  it('validates input before writing', async () => {
    await expect(service.create({})).rejects.toBeInstanceOf(LotValidationError);
    await expect(service.update(lot.id, {})).rejects.toBeInstanceOf(LotValidationError);
    expect(repository.insert).not.toHaveBeenCalled();
    expect(repository.replace).not.toHaveBeenCalled();
  });

  it('propagates persistence errors for every operation', async () => {
    const error = new Error('Storage unavailable');
    for (const method of Object.values(repository)) method.mockRejectedValue(error);
    await expect(service.list()).rejects.toBe(error);
    await expect(service.get(lot.id)).rejects.toBe(error);
    await expect(service.create(data)).rejects.toBe(error);
    await expect(service.update(lot.id, data)).rejects.toBe(error);
    await expect(service.delete(lot.id)).rejects.toBe(error);
  });
});
