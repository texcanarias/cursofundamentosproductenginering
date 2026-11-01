import { beforeEach, describe, expect, it, vi } from 'vitest';
import { DeliveryService } from '../../src/application/delivery-service.js';
import { DeliveryNotFoundError, DeliveryValidationError } from '../../src/domain/delivery.js';

const data = { familiaId: 'FAM-001', fecha: '2026-10-31' };
const delivery = { id: 'generated-id', ...data, observacion: '' };
const repository = { list: vi.fn(), insert: vi.fn(), delete: vi.fn() };
const service = new DeliveryService(repository, () => delivery.id);

beforeEach(() => {
  vi.resetAllMocks();
  repository.list.mockResolvedValue([delivery]);
});

describe('Delivery use cases', () => {
  it('lists deliveries and retrieves one by identifier', async () => {
    await expect(service.list()).resolves.toEqual([delivery]);
    await expect(service.get(delivery.id)).resolves.toEqual(delivery);
    await expect(service.get('missing')).rejects.toBeInstanceOf(DeliveryNotFoundError);
  });

  it('creates a delivery with a server-generated identifier', async () => {
    await expect(service.create({ ...data, id: 'untrusted' })).resolves.toEqual(delivery);
    expect(repository.insert).toHaveBeenCalledWith(delivery);
  });

  it('keeps several deliveries for the same family and date independent', async () => {
    await service.create(data);
    await service.create(data);
    expect(repository.insert).toHaveBeenCalledTimes(2);
  });

  it('deletes only the requested identifier', async () => {
    await service.delete(delivery.id);
    expect(repository.delete).toHaveBeenCalledWith(delivery.id);
  });

  it('validates input before writing', async () => {
    await expect(service.create({})).rejects.toBeInstanceOf(DeliveryValidationError);
    expect(repository.insert).not.toHaveBeenCalled();
  });

  it('propagates persistence errors for every operation', async () => {
    const error = new Error('Storage unavailable');
    for (const method of Object.values(repository)) method.mockRejectedValue(error);
    await expect(service.list()).rejects.toBe(error);
    await expect(service.get(delivery.id)).rejects.toBe(error);
    await expect(service.create(data)).rejects.toBe(error);
    await expect(service.delete(delivery.id)).rejects.toBe(error);
  });
});
