import { TeamRepository } from '../models/repository';
import { Team } from '../models/team';
import { Option, Result } from '@mikuroxina/mini-fn';

export class FetchTeamService {
  private readonly repository: TeamRepository;

  constructor(repository: TeamRepository) {
    this.repository = repository;
  }

  async handle(teamID: string): Promise<Result.Result<Error, Team>> {
    const teamRes = await this.repository.findByID(teamID);
    if (Option.isNone(teamRes)) {
      return Result.err(new Error('Team not found'));
    }
    const team = Option.unwrap(teamRes);
    return Result.ok(team);
  }
}
