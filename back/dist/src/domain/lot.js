import { isCalendarDate } from './calendar-date.js';
export class LotValidationError extends Error {
    campo;
    constructor(campo) {
        super(`El campo ${campo} es obligatorio y debe contener un valor valido.`);
        this.campo = campo;
    }
}
export class LotNotFoundError extends Error {
    constructor() {
        super('La partida no existe.');
    }
}
export function validateLot(input) {
    const fields = readFields(input);
    const nombreProducto = requiredText(fields, 'nombreProducto');
    const caducidad = requiredText(fields, 'caducidad');
    const ubicacion = requiredText(fields, 'ubicacion');
    if (!isCalendarDate(caducidad))
        throw new LotValidationError('caducidad');
    return { nombreProducto, caducidad, ubicacion };
}
function readFields(input) {
    if (typeof input !== 'object' || input === null || Array.isArray(input)) {
        throw new LotValidationError('nombreProducto');
    }
    return input;
}
function requiredText(fields, campo) {
    const value = fields[campo];
    if (typeof value !== 'string' || value.trim() === '')
        throw new LotValidationError(campo);
    return value;
}
