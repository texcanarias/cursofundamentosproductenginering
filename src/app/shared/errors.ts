const READ_ERROR = 'No se pudieron leer los datos guardados en este navegador. Inténtalo de nuevo.';
const WRITE_ERROR = 'No se pudieron guardar los datos en este navegador. Inténtalo de nuevo.';

export function storageErrorMessage(error: unknown, notFoundMessage: string): string {
  switch (statusOf(error)) {
    case 0:
      return READ_ERROR;
    case 404:
      return notFoundMessage;
    case 500:
      return WRITE_ERROR;
    default:
      return 'No se pudo completar la operación. Inténtalo de nuevo.';
  }
}

export function isNotFound(error: unknown): boolean {
  return statusOf(error) === 404;
}

function statusOf(error: unknown): number | null {
  if (error && typeof error === 'object' && 'status' in error) {
    return (error as { status: unknown }).status as number;
  }
  return null;
}
