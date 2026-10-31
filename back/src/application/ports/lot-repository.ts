import type { Lot } from '../../domain/lot.js';

export interface LotRepository {
  list(): Promise<Lot[]>;
  insert(lot: Lot): Promise<void>;
  replace(lot: Lot): Promise<void>;
  delete(id: string): Promise<void>;
}
