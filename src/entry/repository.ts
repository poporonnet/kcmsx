import {Entry} from "./entry.js";
import {Option, Result} from "@mikuroxina/mini-fn";

export interface EntryRepository {
    create(entry: Entry): Promise<Result.Result<Error, Entry>>;
    findByTeamName(name: string): Promise<Option.Option<Entry>>
}
