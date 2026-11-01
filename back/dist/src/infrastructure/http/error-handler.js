import { DeliveryNotFoundError, DeliveryValidationError } from '../../domain/delivery.js';
import { LotNotFoundError, LotValidationError } from '../../domain/lot.js';
export const errorHandler = (error, _request, response, next) => {
    if (response.headersSent)
        return next(error);
    const { status, ...details } = describeError(error);
    response.status(status).json({ error: details });
};
function describeError(error) {
    if (error instanceof LotValidationError || error instanceof DeliveryValidationError) {
        return { status: 400, codigo: 'VALIDACION', mensaje: error.message, campo: error.campo };
    }
    if (error instanceof LotNotFoundError || error instanceof DeliveryNotFoundError) {
        return { status: 404, codigo: 'NO_ENCONTRADO', mensaje: error.message };
    }
    if (error instanceof SyntaxError && 'body' in error) {
        return { status: 400, codigo: 'JSON_INVALIDO', mensaje: 'El cuerpo JSON no es valido.' };
    }
    return { status: 500, codigo: 'ERROR_INTERNO', mensaje: 'No se pudo completar la operacion.' };
}
