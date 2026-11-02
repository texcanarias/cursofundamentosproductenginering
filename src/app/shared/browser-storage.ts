export class LocalStorageError extends Error {
  constructor(readonly status: 0 | 500) {
    super(status === 0 ? 'No se pudo leer el almacenamiento local.' : 'No se pudo escribir.');
    this.name = 'LocalStorageError';
  }
}

export function readList<T>(key: string): T[] {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T[]) : [];
  } catch {
    throw new LocalStorageError(0);
  }
}

export function writeList<T>(key: string, records: T[]): void {
  try {
    localStorage.setItem(key, JSON.stringify(records));
  } catch {
    throw new LocalStorageError(500);
  }
}

export function nextId(prefix: string): string {
  const random =
    typeof crypto !== 'undefined' && 'randomUUID' in crypto
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(16).slice(2)}`;
  return `${prefix}-${random}`;
}
