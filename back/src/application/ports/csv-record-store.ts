export type CsvRecord = Record<string, string>;

export interface CsvRecordStore {
  readAll(): Promise<CsvRecord[]>;
  writeAll(records: CsvRecord[]): Promise<void>;
}
