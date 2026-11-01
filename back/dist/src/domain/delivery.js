import { isCalendarDate } from './calendar-date.js';
export class DeliveryValidationError extends Error {
    campo;
    constructor(campo) {
        super(messageFor(campo));
        this.campo = campo;
    }
}
export class DeliveryNotFoundError extends Error {
    constructor() {
        super('La entrega no esta disponible.');
    }
}
function messageFor(campo) {
    if (campo === 'observacion')
        return 'La observacion debe ser un texto.';
    return `El campo ${campo} es obligatorio y debe contener un valor valido.`;
}
export function validateDelivery(input) {
    const fields = readFields(input);
    const familiaId = requiredText(fields, 'familiaId');
    const fecha = requiredText(fields, 'fecha');
    if (!isCalendarDate(fecha))
        throw new DeliveryValidationError('fecha');
    return { familiaId, fecha, observacion: optionalText(fields['observacion']) };
}
function readFields(input) {
    if (typeof input !== 'object' || input === null || Array.isArray(input)) {
        throw new DeliveryValidationError('familiaId');
    }
    return input;
}
function requiredText(fields, campo) {
    const value = fields[campo];
    if (typeof value !== 'string' || value.trim() === '') {
        throw new DeliveryValidationError(campo);
    }
    return value;
}
function optionalText(value) {
    if (value === undefined || value === null)
        return '';
    if (typeof value !== 'string')
        throw new DeliveryValidationError('observacion');
    return value;
}
