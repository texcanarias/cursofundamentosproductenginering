import { randomUUID } from 'node:crypto';
import { DeliveryNotFoundError, validateDelivery } from '../domain/delivery.js';
export class DeliveryService {
    repository;
    generateId;
    constructor(repository, generateId = randomUUID) {
        this.repository = repository;
        this.generateId = generateId;
    }
    list() {
        return this.repository.list();
    }
    async get(id) {
        const delivery = (await this.repository.list()).find((entry) => entry.id === id);
        if (!delivery)
            throw new DeliveryNotFoundError();
        return delivery;
    }
    async create(input) {
        const data = validateDelivery(input);
        const delivery = { id: this.generateId(), ...data };
        await this.repository.insert(delivery);
        return delivery;
    }
    delete(id) {
        return this.repository.delete(id);
    }
}
