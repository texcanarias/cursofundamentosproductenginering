export interface LotData {
  nombreProducto: string;
  caducidad: string;
  ubicacion: string;
}

export interface Lot extends LotData {
  id: string;
}

export class LotValidationError extends Error {
  constructor(public readonly campo: keyof LotData) {
    super(`El campo ${campo} es obligatorio y debe contener un valor valido.`);
  }
}

export class LotNotFoundError extends Error {
  constructor() {
    super('La partida no existe.');
  }
}

export function validateLot(input: unknown): LotData {
  const fields = readFields(input);
  const nombreProducto = requiredText(fields, 'nombreProducto');
  const caducidad = requiredText(fields, 'caducidad');
  const ubicacion = requiredText(fields, 'ubicacion');
  if (!isCalendarDate(caducidad)) throw new LotValidationError('caducidad');
  return { nombreProducto, caducidad, ubicacion };
}

function readFields(input: unknown): Record<string, unknown> {
  if (typeof input !== 'object' || input === null || Array.isArray(input)) {
    throw new LotValidationError('nombreProducto');
  }
  return input as Record<string, unknown>;
}

function requiredText(fields: Record<string, unknown>, campo: keyof LotData): string {
  const value = fields[campo];
  if (typeof value !== 'string' || value.trim() === '') throw new LotValidationError(campo);
  return value;
}

function isCalendarDate(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value) || value.startsWith('0000-')) return false;
  const date = new Date(`${value}T00:00:00.000Z`);
  return Number.isFinite(date.getTime()) && date.toISOString().slice(0, 10) === value;
}
