import { randomUUID } from 'node:crypto';
import { LotNotFoundError, validateLot } from '../domain/lot.js';
export class LotService {
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
        const lot = (await this.repository.list()).find((entry) => entry.id === id);
        if (!lot)
            throw new LotNotFoundError();
        return lot;
    }
    async create(input) {
        const data = validateLot(input);
        const lot = { id: this.generateId(), ...data };
        await this.repository.insert(lot);
        return lot;
    }
    async update(id, input) {
        const lot = { id, ...validateLot(input) };
        await this.repository.replace(lot);
        return lot;
    }
    delete(id) {
        return this.repository.delete(id);
    }
}
