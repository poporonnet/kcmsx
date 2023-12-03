import {EntryRepository} from "../repository.js";
import {Entry} from "../entry.js";

export class EntryService {
    private readonly  repository: EntryRepository;
    constructor(repository: EntryRepository) {
        this.repository = repository;
    }
    async create(entry: Entry) {
        return await this.repository.create(entry);
    }
}
