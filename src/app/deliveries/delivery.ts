import { storageErrorMessage } from '../shared/errors';

export interface DeliveryData {
  familiaId: string;
  fecha: string;
  observacion: string;
}

export interface Delivery extends DeliveryData {
  id: string;
}

export {
  calendarDate,
  calendarLabel as deliveryDateLabel,
  isCalendarDate,
  requiredText,
} from '../shared/calendar-date';

export function deliveryError(error: unknown): string {
  return storageErrorMessage(error, 'Esta entrega ya no está disponible.');
}
