import { EntryRepository } from '../repository.js';
import { Option, Result } from '@mikuroxina/mini-fn';
import { Entry, EntryCategory } from '../entry.js';
import { readFile, writeFile } from 'node:fs/promises';

interface JSONData {
  entry: Array<EntryJSON>;
  match: Array<object>;
}

export interface EntryJSON {
  id: string;
  teamName: string;
  members: Array<string>;
  isMultiWalk: boolean;
  category: string;
}

export class JSONEntryRepository implements EntryRepository {
  private data: Array<Entry>;

  private constructor(data?: Array<Entry>) {
    this.data = data ?? [];
  }

  static async new(): Promise<JSONEntryRepository> {
    const data = await this.load();
    return new JSONEntryRepository(data.entry.map((e) => JSONEntryRepository.jsonToEntry(e)));
  }

  async create(entry: Entry): Promise<Result.Result<Error, Entry>> {
    if (this.isExists(entry)) {
      return Result.err(new Error('Entry already exists'));
    }
    this.data.push(entry);
    await this.save();
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
    await this.save();
    return Option.none();
  }

  private async save() {
    const data = await readFile('./data.json', 'utf-8');
    const baseData = JSON.parse(data) as JSONData;

    baseData.entry = this.data.map((e) => JSONEntryRepository.entryToJSON(e));
    await writeFile('./data.json', JSON.stringify(baseData, null, 2), 'utf-8');
  }

  private static async load(): Promise<JSONData> {
    const data = await readFile('./data.json', 'utf-8');
    const parsed = JSON.parse(data) as JSONData;
    parsed.entry = parsed.entry.map((e) => JSONEntryRepository.jsonToEntry(e));
    return parsed;
  }

  private isExists(entry: Entry): boolean {
    for (const v of this.data) {
      if (v.teamName === entry.teamName || v.id === entry.id) {
        console.error('Entry already exists');
        return true;
      }
    }
    return false;
  }

  private static entryToJSON(entry: Entry): EntryJSON {
    return {
      id: entry.id,
      teamName: entry.teamName,
      members: entry.members,
      isMultiWalk: entry.isMultiWalk,
      category: entry.category,
    };
  }

  private static jsonToEntry(json: EntryJSON): Entry {
    return Entry.new({
      id: json.id,
      teamName: json.teamName,
      members: json.members,
      isMultiWalk: json.isMultiWalk,
      category: json.category as EntryCategory,
    });
  }
}
