import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import type { Delivery, DeliveryData } from './delivery';

@Injectable({ providedIn: 'root' })
export class DeliveryApi {
  private readonly http = inject(HttpClient);
  private readonly url = '/api/entregas';

  list() {
    return this.http.get<Delivery[]>(this.url);
  }

  get(id: string) {
    return this.http.get<Delivery>(this.path(id));
  }

  create(data: DeliveryData) {
    return this.http.post<Delivery>(this.url, data);
  }

  delete(id: string) {
    return this.http.delete<void>(this.path(id));
  }

  private path(id: string): string {
    return `${this.url}/${encodeURIComponent(id)}`;
  }
}
