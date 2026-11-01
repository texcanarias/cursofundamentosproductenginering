import express from 'express';
import { DeliveryService } from '../../application/delivery-service.js';
import { LotService } from '../../application/lot-service.js';
import { CsvDeliveryRepository } from '../csv/csv-delivery-repository.js';
import { CsvFileStore } from '../csv/csv-file-store.js';
import { CsvLotRepository } from '../csv/csv-lot-repository.js';
import { createDeliveryRouter } from './delivery-router.js';
import { errorHandler } from './error-handler.js';
import { createLotRouter } from './lot-router.js';
export function createApp(lotStore = storeFrom('LOTES_CSV_PATH', 'data/lotes.csv'), deliveryStore = storeFrom('ENTREGAS_CSV_PATH', 'data/entregas.csv')) {
    const app = express();
    app.use(express.json());
    app.get('/api/health', (_request, response) => response.json({ status: 'ok' }));
    app.use('/api/lotes', createLotRouter(new LotService(new CsvLotRepository(lotStore))));
    app.use('/api/entregas', createDeliveryRouter(new DeliveryService(new CsvDeliveryRepository(deliveryStore))));
    app.use(errorHandler);
    return app;
}
function storeFrom(variable, fallback) {
    return new CsvFileStore(process.env[variable] ?? fallback);
}
