import { stringify } from 'csv-stringify/sync';
import type { CsvRecord } from '../../application/ports/csv-record-store.js';

export function serializeRecords(records: CsvRecord[]): string {
  if (records.length === 0) return '';
  return stringify(records, { header: true });
}
