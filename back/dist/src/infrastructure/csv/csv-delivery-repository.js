import { DeliveryNotFoundError, validateDelivery } from '../../domain/delivery.js';
export class CsvDeliveryRepository {
    store;
    queue = Promise.resolve();
    constructor(store) {
        this.store = store;
    }
    async list() {
        return (await this.store.readAll()).map((record) => {
            if (!record.id)
                throw new Error('Invalid persisted delivery identifier');
            return { id: record.id, ...validateDelivery(record) };
        });
    }
    insert(delivery) {
        return this.mutate((deliveries) => [...deliveries, delivery]);
    }
    delete(id) {
        return this.mutate((deliveries) => {
            this.requireDelivery(deliveries, id);
            return deliveries.filter((delivery) => delivery.id !== id);
        });
    }
    requireDelivery(deliveries, id) {
        if (!deliveries.some((delivery) => delivery.id === id)) {
            throw new DeliveryNotFoundError();
        }
    }
    mutate(change) {
        const operation = this.queue.then(async () => {
            const deliveries = change(await this.list());
            await this.store.writeAll(deliveries.map((delivery) => ({ ...delivery })));
        });
        this.queue = operation.catch(() => undefined);
        return operation;
    }
}
