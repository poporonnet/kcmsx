import { Option, Result } from '@mikuroxina/mini-fn';
import { TeamRepository } from '../models/repository.js';
import { Team, TeamID } from '../models/team.js';

export class FetchTeamService {
  private readonly repository: TeamRepository;

  constructor(repository: TeamRepository) {
    this.repository = repository;
  }

  async fetchAll(): Promise<Result.Result<Error, Team[]>> {
    return await this.repository.findAll();
  }

  async fetchByID(id: TeamID): Promise<Result.Result<Error, Team>> {
    const res = await this.repository.findByID(id);
    if (Option.isNone(res)) {
      return Result.err(new Error('Not found'));
    }

    return Result.ok(Option.unwrap(res));
  }

  async fetchByTeamName(name: string): Promise<Result.Result<Error, Team>> {
    const res = await this.repository.findByTeamName(name);
    if (Option.isNone(res)) {
      return Result.err(new Error('Not found'));
    }

    return Result.ok(Option.unwrap(res));
  }
}
