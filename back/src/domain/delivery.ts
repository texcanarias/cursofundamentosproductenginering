import { isCalendarDate } from './calendar-date.js';

export interface DeliveryData {
  familiaId: string;
  fecha: string;
  observacion: string;
}

export interface Delivery extends DeliveryData {
  id: string;
}

export class DeliveryValidationError extends Error {
  constructor(public readonly campo: keyof DeliveryData) {
    super(messageFor(campo));
  }
}

export class DeliveryNotFoundError extends Error {
  constructor() {
    super('La entrega no esta disponible.');
  }
}

function messageFor(campo: keyof DeliveryData): string {
  if (campo === 'observacion') return 'La observacion debe ser un texto.';
  return `El campo ${campo} es obligatorio y debe contener un valor valido.`;
}

export function validateDelivery(input: unknown): DeliveryData {
  const fields = readFields(input);
  const familiaId = requiredText(fields, 'familiaId');
  const fecha = requiredText(fields, 'fecha');
  if (!isCalendarDate(fecha)) throw new DeliveryValidationError('fecha');
  return { familiaId, fecha, observacion: optionalText(fields['observacion']) };
}

function readFields(input: unknown): Record<string, unknown> {
  if (typeof input !== 'object' || input === null || Array.isArray(input)) {
    throw new DeliveryValidationError('familiaId');
  }
  return input as Record<string, unknown>;
}

function requiredText(fields: Record<string, unknown>, campo: 'familiaId' | 'fecha'): string {
  const value = fields[campo];
  if (typeof value !== 'string' || value.trim() === '') {
    throw new DeliveryValidationError(campo);
  }
  return value;
}

function optionalText(value: unknown): string {
  if (value === undefined || value === null) return '';
  if (typeof value !== 'string') throw new DeliveryValidationError('observacion');
  return value;
}
