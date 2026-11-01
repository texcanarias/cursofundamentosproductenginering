import { randomUUID } from 'node:crypto';
import { mkdir, readFile, rename, writeFile } from 'node:fs/promises';
import { dirname } from 'node:path';
import { parse } from 'csv-parse/sync';
import { serializeRecords } from './serialize-records.js';
export class CsvFileStore {
    filePath;
    constructor(filePath) {
        this.filePath = filePath;
    }
    async readAll() {
        try {
            const content = await readFile(this.filePath, 'utf8');
            return parse(content, { columns: true, skip_empty_lines: true, bom: true });
        }
        catch (error) {
            if (isMissingFile(error)) {
                await mkdir(dirname(this.filePath), { recursive: true });
                await writeFile(this.filePath, '', 'utf8');
                return [];
            }
            throw error;
        }
    }
    async writeAll(records) {
        await mkdir(dirname(this.filePath), { recursive: true });
        const temporaryPath = `${this.filePath}.${randomUUID()}.tmp`;
        await writeFile(temporaryPath, serializeRecords(records), 'utf8');
        await rename(temporaryPath, this.filePath);
    }
}
function isMissingFile(error) {
    return error instanceof Error && 'code' in error && error.code === 'ENOENT';
}
