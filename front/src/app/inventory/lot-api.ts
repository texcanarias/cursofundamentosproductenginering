import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import type { Lot, LotData } from './lot';

@Injectable({ providedIn: 'root' })
export class LotApi {
  private readonly http = inject(HttpClient);
  private readonly url = '/api/lotes';

  list() {
    return this.http.get<Lot[]>(this.url);
  }

  get(id: string) {
    return this.http.get<Lot>(this.path(id));
  }

  create(data: LotData) {
    return this.http.post<Lot>(this.url, data);
  }

  update(id: string, data: LotData) {
    return this.http.put<Lot>(this.path(id), data);
  }

  delete(id: string) {
    return this.http.delete<void>(this.path(id));
  }

  private path(id: string): string {
    return `${this.url}/${encodeURIComponent(id)}`;
  }
}
