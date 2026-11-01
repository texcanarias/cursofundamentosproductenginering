import { HttpErrorResponse } from '@angular/common/http';

export function apiErrorMessage(error: unknown, notFoundMessage: string): string {
  if (!(error instanceof HttpErrorResponse)) return 'No se pudo completar la operación.';
  if (error.status === 0) return 'No hay conexión con el servidor. Inténtalo de nuevo.';
  if (error.status === 404) return notFoundMessage;
  return typeof error.error?.error?.mensaje === 'string'
    ? error.error.error.mensaje
    : 'No se pudo completar la operación. Inténtalo de nuevo.';
}
