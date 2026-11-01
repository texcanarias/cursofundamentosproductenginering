import { apiErrorMessage } from '../shared/http-error';

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
  return apiErrorMessage(error, 'Esta entrega ya no está disponible.');
}
