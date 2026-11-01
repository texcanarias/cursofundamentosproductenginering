import { randomUUID } from 'node:crypto';
import { DeliveryNotFoundError, validateDelivery, type Delivery } from '../domain/delivery.js';
import type { DeliveryRepository } from './ports/delivery-repository.js';

export class DeliveryService {
  constructor(
    private readonly repository: DeliveryRepository,
    private readonly generateId: () => string = randomUUID,
  ) {}

  list(): Promise<Delivery[]> {
    return this.repository.list();
  }

  async get(id: string): Promise<Delivery> {
    const delivery = (await this.repository.list()).find((entry) => entry.id === id);
    if (!delivery) throw new DeliveryNotFoundError();
    return delivery;
  }

  async create(input: unknown): Promise<Delivery> {
    const data = validateDelivery(input);
    const delivery = { id: this.generateId(), ...data };
    await this.repository.insert(delivery);
    return delivery;
  }

  delete(id: string): Promise<void> {
    return this.repository.delete(id);
  }
}
