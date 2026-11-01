import type { CsvRecordStore } from '../../application/ports/csv-record-store.js';
import type { DeliveryRepository } from '../../application/ports/delivery-repository.js';
import { DeliveryNotFoundError, validateDelivery, type Delivery } from '../../domain/delivery.js';

export class CsvDeliveryRepository implements DeliveryRepository {
  private queue: Promise<void> = Promise.resolve();

  constructor(private readonly store: CsvRecordStore) {}

  async list(): Promise<Delivery[]> {
    return (await this.store.readAll()).map((record) => {
      if (!record.id) throw new Error('Invalid persisted delivery identifier');
      return { id: record.id, ...validateDelivery(record) };
    });
  }

  insert(delivery: Delivery): Promise<void> {
    return this.mutate((deliveries) => [...deliveries, delivery]);
  }

  delete(id: string): Promise<void> {
    return this.mutate((deliveries) => {
      this.requireDelivery(deliveries, id);
      return deliveries.filter((delivery) => delivery.id !== id);
    });
  }

  private requireDelivery(deliveries: Delivery[], id: string): void {
    if (!deliveries.some((delivery) => delivery.id === id)) {
      throw new DeliveryNotFoundError();
    }
  }

  private mutate(change: (deliveries: Delivery[]) => Delivery[]): Promise<void> {
    const operation = this.queue.then(async () => {
      const deliveries = change(await this.list());
      await this.store.writeAll(deliveries.map((delivery) => ({ ...delivery })));
    });
    this.queue = operation.catch(() => undefined);
    return operation;
  }
}
