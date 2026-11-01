import type { Delivery } from '../../domain/delivery.js';

export interface DeliveryRepository {
  list(): Promise<Delivery[]>;
  insert(delivery: Delivery): Promise<void>;
  delete(id: string): Promise<void>;
}
