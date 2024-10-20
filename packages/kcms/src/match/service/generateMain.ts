import { Result } from '@mikuroxina/mini-fn';
import { SnowflakeIDGenerator } from '../../id/main';
import { TeamID } from '../../team/models/team';
import { MainMatch } from '../model/main';
import { MainMatchRepository } from '../model/repository';

export class GenerateMainMatchService {
  constructor(
    private readonly mainMatchRepository: MainMatchRepository,
    private readonly idGenerator: SnowflakeIDGenerator
  ) {}

  async handle(teamID1: TeamID, teamID2: TeamID): Promise<Result.Result<Error, MainMatch>> {
    const newIDRes = this.idGenerator.generate<MainMatch>();
    if (Result.isErr(newIDRes)) {
      return newIDRes;
    }
    const newID = Result.unwrap(newIDRes);

    const match = MainMatch.new({
      id: newID,
      courseIndex: 1,
      matchIndex: 1,
      runResults: [],
      teamId1: teamID1,
      teamId2: teamID2,
    });

    const matches = await this.mainMatchRepository.create(match);
    if (Result.isErr(matches)) {
      return matches;
    }

    return Result.ok(match);
  }
}