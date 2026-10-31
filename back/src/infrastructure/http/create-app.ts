import express from 'express';
import { LotService } from '../../application/lot-service.js';
import type { CsvRecordStore } from '../../application/ports/csv-record-store.js';
import { CsvFileStore } from '../csv/csv-file-store.js';
import { CsvLotRepository } from '../csv/csv-lot-repository.js';
import { errorHandler } from './error-handler.js';
import { createLotRouter } from './lot-router.js';

export function createApp(store: CsvRecordStore = defaultStore()) {
  const app = express();
  app.use(express.json());
  app.get('/api/health', (_request, response) => response.json({ status: 'ok' }));
  app.use('/api/lotes', createLotRouter(new LotService(new CsvLotRepository(store))));
  app.use(errorHandler);
  return app;
}

function defaultStore(): CsvRecordStore {
  return new CsvFileStore(process.env.LOTES_CSV_PATH ?? 'data/lotes.csv');
}
