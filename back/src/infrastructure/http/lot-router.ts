import { Router } from 'express';
import type { LotService } from '../../application/lot-service.js';

export function createLotRouter(service: LotService): Router {
  const router = Router();
  router.get('/', async (_request, response) => response.json(await service.list()));
  router.get('/:id', async (request, response) => {
    response.json(await service.get(request.params.id));
  });
  router.post('/', async (request, response) => {
    response.status(201).json(await service.create(request.body));
  });
  router.put('/:id', async (request, response) => {
    response.json(await service.update(request.params.id, request.body));
  });
  router.delete('/:id', async (request, response) => {
    await service.delete(request.params.id);
    response.status(204).end();
  });
  return router;
}
