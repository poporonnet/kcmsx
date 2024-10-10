import { Option, Result } from '@mikuroxina/mini-fn';
import { TeamRepository } from '../models/repository.js';
import { TeamID } from '../models/team';

export class DeleteTeamService {
  private readonly repository: TeamRepository;

  constructor(repository: TeamRepository) {
    this.repository = repository;
  }

  async handle(teamID: TeamID): Promise<Result.Result<Error, void>> {
    const res = await this.repository.findByID(teamID);
    if (Option.isNone(res)) {
      return Result.err(new Error('Team not found'));
    }
    const deleteTeamRes = await this.repository.delete(teamID);
    if (Option.isSome(deleteTeamRes)) {
      return Result.err(Option.unwrap(deleteTeamRes));
    }
    return Result.ok(undefined);
  }
}
