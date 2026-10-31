import { randomUUID } from 'node:crypto';
import { LotNotFoundError, validateLot, type Lot } from '../domain/lot.js';
import type { LotRepository } from './ports/lot-repository.js';

export class LotService {
  constructor(
    private readonly repository: LotRepository,
    private readonly generateId: () => string = randomUUID,
  ) {}

  list(): Promise<Lot[]> {
    return this.repository.list();
  }

  async get(id: string): Promise<Lot> {
    const lot = (await this.repository.list()).find((entry) => entry.id === id);
    if (!lot) throw new LotNotFoundError();
    return lot;
  }

  async create(input: unknown): Promise<Lot> {
    const data = validateLot(input);
    const lot = { id: this.generateId(), ...data };
    await this.repository.insert(lot);
    return lot;
  }

  async update(id: string, input: unknown): Promise<Lot> {
    const lot = { id, ...validateLot(input) };
    await this.repository.replace(lot);
    return lot;
  }

  delete(id: string): Promise<void> {
    return this.repository.delete(id);
  }
}
