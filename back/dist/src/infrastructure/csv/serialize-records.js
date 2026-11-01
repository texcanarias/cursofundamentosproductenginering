import { stringify } from 'csv-stringify/sync';
export function serializeRecords(records) {
    if (records.length === 0)
        return '';
    return stringify(records, { header: true });
}
