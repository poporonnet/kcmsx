import { Entry } from './entry.js';
import { Option, Result } from '@mikuroxina/mini-fn';

export interface EntryRepository {
  create(entry: Entry): Promise<Result.Result<Error, Entry>>;
  findByTeamName(name: string): Promise<Option.Option<Entry>>;
  findAll(): Promise<Result.Result<Error, Array<Entry>>>;
  findByID(id: string): Promise<Option.Option<Entry>>;
  delete(id: string): Promise<Option.Option<Error>>;
}
