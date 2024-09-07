import { TeamRepository } from '../models/repository.js';
import { Option, Result } from '@mikuroxina/mini-fn';
import { Team, TeamID } from '../models/team.js';

export class DummyRepository implements TeamRepository {
  private data: Map<TeamID, Team>;

  constructor(data: Team[] = []) {
    this.data = new Map<TeamID, Team>(data.map((v) => [v.getId(), v]));
  }

  async create(entry: Team): Promise<Result.Result<Error, Team>> {
    const res = this.data.set(entry.getId(), entry);
    if (!res) {
      return Result.err(new Error('Team not found'));
    }

    return Result.ok(entry);
  }

  async findByTeamName(name: string): Promise<Option.Option<Team>> {
    const entry = [...this.data].map((v) => v[1]).find((e) => e.getTeamName() === name);
    if (!entry) {
      return Option.none();
    }
    return Option.some(entry);
  }

  async findByID(id: string): Promise<Option.Option<Team>> {
    const entry = [...this.data].map((v) => v[1]).find((e) => e.getId() === id);
    if (entry === undefined) {
      return Option.none();
    }
    return Option.some(entry);
  }

  async findAll(): Promise<Result.Result<Error, Team[]>> {
    return Result.ok([...this.data].map((v) => v[1]));
  }

  async delete(id: TeamID): Promise<Option.Option<Error>> {
    this.data.delete(id);
    return Option.none();
  }

  async update(team: Team): Promise<Result.Result<Error, Team>> {
    const res = this.data.get(team.getId());
    if (!res) {
      return Result.err(new Error('Team not found'));
    }

    this.data.set(team.getId(), team);
    return Result.ok(team);
  }

  reset(data: Team[] = []) {
    this.data = new Map<TeamID, Team>(data.map((v) => [v.getId(), v]));
  }
}
