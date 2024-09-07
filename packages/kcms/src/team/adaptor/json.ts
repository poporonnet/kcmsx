import { TeamRepository } from '../models/repository.js';
import { Option, Result } from '@mikuroxina/mini-fn';
import { Team, Department, TeamID } from '../models/team.js';
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

export class JSONEntryRepository implements TeamRepository {
  private data: Array<Team>;

  private constructor(data?: Array<Team>) {
    this.data = data ?? [];
  }

  static async new(): Promise<JSONEntryRepository> {
    const data = await this.load();
    return new JSONEntryRepository(data.entry.map((e) => JSONEntryRepository.jsonToEntry(e)));
  }

  async create(entry: Team): Promise<Result.Result<Error, Team>> {
    if (this.isExists(entry)) {
      return Result.err(new Error('Entry already exists'));
    }
    this.data.push(entry);
    await this.save();
    return Result.ok(entry);
  }

  async findByTeamName(name: string): Promise<Option.Option<Team>> {
    const entry = this.data.find((e) => e.getTeamName() === name);
    if (entry === undefined) {
      return Option.none();
    }
    return Option.some(entry);
  }

  async findByID(id: string): Promise<Option.Option<Team>> {
    const entry = this.data.find((e) => e.getId() === id);
    if (entry === undefined) {
      return Option.none();
    }
    return Option.some(entry);
  }

  async findAll(): Promise<Result.Result<Error, Array<Team>>> {
    return Result.ok(this.data);
  }

  async delete(id: string): Promise<Option.Option<Error>> {
    this.data = this.data.filter((e) => e.getId() !== id);
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
    return JSON.parse(data) as JSONData;
  }

  private isExists(entry: Team): boolean {
    for (const v of this.data) {
      if (v.getTeamName === entry.getTeamName || v.getId === entry.getId) {
        console.error('Entry already exists');
        return true;
      }
    }
    return false;
  }

  private static entryToJSON(entry: Team): EntryJSON {
    return {
      id: entry.getId(),
      teamName: entry.getTeamName(),
      members: entry.getMembers(),
      isMultiWalk: entry.getIsMultiWalk(),
      category: entry.getCategory(),
    };
  }

  private static jsonToEntry(json: EntryJSON): Team {
    return Team.new({
      id: json.id as TeamID,
      teamName: json.teamName,
      members: json.members,
      isMultiWalk: json.isMultiWalk,
      category: json.category as Department,
    });
  }
}
