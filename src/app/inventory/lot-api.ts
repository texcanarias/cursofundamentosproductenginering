import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BrowserRepository } from '../shared/browser-repository';
import type { Lot, LotData } from './lot';

const KEY = 'a-la-par:lotes';

@Injectable({ providedIn: 'root' })
export class LotApi {
  private readonly repository = new BrowserRepository<Lot, LotData>(KEY, 'lot');

  list(): Observable<Lot[]> {
    return this.repository.list();
  }

  get(id: string): Observable<Lot> {
    return this.repository.get(id);
  }

  create(data: LotData): Observable<Lot> {
    return this.repository.create(data);
  }

  update(id: string, data: LotData): Observable<Lot> {
    return this.repository.update(id, data);
  }

  delete(id: string): Observable<void> {
    return this.repository.delete(id);
  }
}
