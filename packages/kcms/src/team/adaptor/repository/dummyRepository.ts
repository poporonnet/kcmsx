import { TeamRepository } from '../../models/repository';
import { Option, Result } from '@mikuroxina/mini-fn';
import { Team, TeamID } from '../../models/team';

export class DummyRepository implements TeamRepository {
  private data: Map<TeamID, Team>;

  constructor(data: Team[] = []) {
    this.data = new Map<TeamID, Team>(data.map((v) => [v.getId(), v]));
  }

  async create(team: Team): Promise<Result.Result<Error, Team>> {
    const res = this.data.set(team.getId(), team);
    if (!res) {
      return Result.err(new Error('Team not found'));
    }

    return Result.ok(team);
  }

  async findByTeamName(name: string): Promise<Option.Option<Team>> {
    const team = [...this.data.values()].find((v) => v.getTeamName() === name);
    if (!team) {
      return Option.none();
    }
    return Option.some(team);
  }

  async findByID(id: string): Promise<Option.Option<Team>> {
    const team = [...this.data.values()].find((v) => v.getId() === id);
    if (!team) {
      return Option.none();
    }
    return Option.some(team);
  }

  async findAll(): Promise<Result.Result<Error, Team[]>> {
    return Result.ok([...this.data.values()]);
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
