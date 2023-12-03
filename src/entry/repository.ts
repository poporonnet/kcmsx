import {Entry} from "./entry.js";
import {Result} from "@mikuroxina/mini-fn";

export interface EntryRepository {
    create(entry: Entry): Promise<Result.Result<Error, Entry>>;
}
