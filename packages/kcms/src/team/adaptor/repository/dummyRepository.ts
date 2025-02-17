import { Option, Result } from '@mikuroxina/mini-fn';
import { TeamRepository } from '../../models/repository';
import { Team, TeamID } from '../../models/team';

export class DummyRepository implements TeamRepository {
  private data: Map<TeamID, Team>;

  constructor(data: Team[] = []) {
    this.data = new Map<TeamID, Team>(data.map((v) => [v.getID(), v]));
  }

  async create(team: Team): Promise<Result.Result<Error, Team>> {
    const res = this.data.set(team.getID(), team);
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
    const team = [...this.data.values()].find((v) => v.getID() === id);
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
    const res = this.data.get(team.getID());
    if (!res) {
      return Result.err(new Error('Team not found'));
    }

    this.data.set(team.getID(), team);
    return Result.ok(team);
  }

  reset(data: Team[] = []) {
    this.data = new Map<TeamID, Team>(data.map((v) => [v.getID(), v]));
  }
}
