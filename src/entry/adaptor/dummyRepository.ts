import {EntryRepository} from "../repository.js";
import {Result} from "@mikuroxina/mini-fn";
import {Entry} from "../entry.js";

export class DummyRepository implements EntryRepository{
    private data: Array<Entry>
    constructor() {
        this.data = [];
    }

    async create(entry: Entry): Promise<Result.Result<Error, Entry>> {
        this.data.push(entry);
        return Result.ok(entry);
    }
}
