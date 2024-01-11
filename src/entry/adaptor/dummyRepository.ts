import { EntryRepository } from '../repository.js';
import { Option, Result } from '@mikuroxina/mini-fn';
import { Entry } from '../entry.js';

export class DummyRepository implements EntryRepository {
  private data: Array<Entry>;
  constructor() {
    this.data = [];
  }

  async create(entry: Entry): Promise<Result.Result<Error, Entry>> {
    this.data.push(entry);
    return Result.ok(entry);
  }

  async findByTeamName(name: string): Promise<Option.Option<Entry>> {
    const entry = this.data.find((e) => e.teamName === name);
    if (entry === undefined) {
      return Option.none();
    }
    return Option.some(entry);
  }

  async findByID(id: string): Promise<Option.Option<Entry>> {
    const entry = this.data.find((e) => e.id === id);
    if (entry === undefined) {
      return Option.none();
    }
    return Option.some(entry);
  }

  async findAll(): Promise<Result.Result<Error, Array<Entry>>> {
    return Result.ok(this.data);
  }

  async delete(id: string): Promise<Option.Option<Error>> {
    this.data = this.data.filter((e) => e.id !== id);
    return Option.none();
  }

  reset() {
    this.data = [];
  }
}
