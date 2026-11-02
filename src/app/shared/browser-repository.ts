import { Observable, of, throwError } from 'rxjs';
import { nextId, readList, writeList } from './browser-storage';

export class NotFoundError extends Error {
  readonly status = 404;

  constructor() {
    super('El registro ya no está disponible.');
    this.name = 'NotFoundError';
  }
}

export class BrowserRepository<T extends { id: string }, D> {
  constructor(
    private readonly key: string,
    private readonly prefix: string,
  ) {}

  list(): Observable<T[]> {
    return this.run(() => readList<T>(this.key));
  }

  get(id: string): Observable<T> {
    return this.run(() => this.find(id));
  }

  create(data: D): Observable<T> {
    return this.run(() => {
      const record = { id: nextId(this.prefix), ...data } as unknown as T;
      writeList(this.key, [...readList<T>(this.key), record]);
      return record;
    });
  }

  update(id: string, data: D): Observable<T> {
    return this.run(() => {
      const records = readList<T>(this.key);
      const index = records.findIndex((record) => record.id === id);
      if (index === -1) throw new NotFoundError();
      const record = { ...data, id } as unknown as T;
      records[index] = record;
      writeList(this.key, records);
      return record;
    });
  }

  delete(id: string): Observable<void> {
    return this.run(() => {
      const records = readList<T>(this.key);
      if (!records.some((record) => record.id === id)) throw new NotFoundError();
      writeList(
        this.key,
        records.filter((record) => record.id !== id),
      );
    });
  }

  private find(id: string): T {
    const record = readList<T>(this.key).find((entry) => entry.id === id);
    if (!record) throw new NotFoundError();
    return record;
  }

  private run<R>(operation: () => R): Observable<R> {
    try {
      return of(operation());
    } catch (error) {
      return throwError(() => error);
    }
  }
}
