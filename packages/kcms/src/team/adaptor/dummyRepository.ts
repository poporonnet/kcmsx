import { TeamRepository } from '../models/repository.js';
import { Option, Result } from '@mikuroxina/mini-fn';
import { Team } from '../models/team.js';

export class DummyRepository implements TeamRepository {
  private data: Array<Team>;
  constructor(data?: Array<Team>) {
    this.data = data ?? [];
  }

  async create(entry: Team): Promise<Result.Result<Error, Team>> {
    this.data.push(entry);
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
    return Option.none();
  }

  reset() {
    this.data = [];
  }
}
