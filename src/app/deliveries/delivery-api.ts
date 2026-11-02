import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BrowserRepository } from '../shared/browser-repository';
import type { Delivery, DeliveryData } from './delivery';

const KEY = 'a-la-par:entregas';

@Injectable({ providedIn: 'root' })
export class DeliveryApi {
  private readonly repository = new BrowserRepository<Delivery, DeliveryData>(KEY, 'delivery');

  list(): Observable<Delivery[]> {
    return this.repository.list();
  }

  get(id: string): Observable<Delivery> {
    return this.repository.get(id);
  }

  create(data: DeliveryData): Observable<Delivery> {
    return this.repository.create(data);
  }

  delete(id: string): Observable<void> {
    return this.repository.delete(id);
  }
}
