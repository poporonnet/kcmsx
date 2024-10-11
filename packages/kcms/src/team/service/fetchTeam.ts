import { Option, Result } from '@mikuroxina/mini-fn';
import { TeamRepository } from '../models/repository';
import { Team, TeamID } from '../models/team';

export class FetchTeamService {
  private readonly repository: TeamRepository;

  constructor(repository: TeamRepository) {
    this.repository = repository;
  }

  async handle(teamID: TeamID): Promise<Result.Result<Error, Team>> {
    const teamRes = await this.repository.findByID(teamID);
    if (Option.isNone(teamRes)) {
      return Result.err(new Error('Team not found'));
    }
    return Result.ok(Option.unwrap(teamRes));
  }
}
