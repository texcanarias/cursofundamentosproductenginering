import type { CsvRecordStore } from '../../application/ports/csv-record-store.js';
import type { LotRepository } from '../../application/ports/lot-repository.js';
import { LotNotFoundError, validateLot, type Lot } from '../../domain/lot.js';

export class CsvLotRepository implements LotRepository {
  private queue: Promise<void> = Promise.resolve();

  constructor(private readonly store: CsvRecordStore) {}

  async list(): Promise<Lot[]> {
    return (await this.store.readAll()).map((record) => {
      if (!record.id) throw new Error('Invalid persisted lot identifier');
      return { id: record.id, ...validateLot(record) };
    });
  }

  insert(lot: Lot): Promise<void> {
    return this.mutate((lots) => [...lots, lot]);
  }

  replace(lot: Lot): Promise<void> {
    return this.mutate((lots) => {
      this.requireLot(lots, lot.id);
      return lots.map((entry) => (entry.id === lot.id ? lot : entry));
    });
  }

  delete(id: string): Promise<void> {
    return this.mutate((lots) => {
      this.requireLot(lots, id);
      return lots.filter((lot) => lot.id !== id);
    });
  }

  private requireLot(lots: Lot[], id: string): void {
    if (!lots.some((lot) => lot.id === id)) throw new LotNotFoundError();
  }

  private mutate(change: (lots: Lot[]) => Lot[]): Promise<void> {
    const operation = this.queue.then(async () => {
      const lots = change(await this.list());
      await this.store.writeAll(lots.map((lot) => ({ ...lot })));
    });
    this.queue = operation.catch(() => undefined);
    return operation;
  }
}
