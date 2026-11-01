import { LotNotFoundError, validateLot } from '../../domain/lot.js';
export class CsvLotRepository {
    store;
    queue = Promise.resolve();
    constructor(store) {
        this.store = store;
    }
    async list() {
        return (await this.store.readAll()).map((record) => {
            if (!record.id)
                throw new Error('Invalid persisted lot identifier');
            return { id: record.id, ...validateLot(record) };
        });
    }
    insert(lot) {
        return this.mutate((lots) => [...lots, lot]);
    }
    replace(lot) {
        return this.mutate((lots) => {
            this.requireLot(lots, lot.id);
            return lots.map((entry) => (entry.id === lot.id ? lot : entry));
        });
    }
    delete(id) {
        return this.mutate((lots) => {
            this.requireLot(lots, id);
            return lots.filter((lot) => lot.id !== id);
        });
    }
    requireLot(lots, id) {
        if (!lots.some((lot) => lot.id === id))
            throw new LotNotFoundError();
    }
    mutate(change) {
        const operation = this.queue.then(async () => {
            const lots = change(await this.list());
            await this.store.writeAll(lots.map((lot) => ({ ...lot })));
        });
        this.queue = operation.catch(() => undefined);
        return operation;
    }
}
