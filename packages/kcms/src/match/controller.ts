import { Result } from '@mikuroxina/mini-fn';
import { MatchType } from 'config';
import { TeamID } from '../team/models/team';
import { MainMatchID } from './model/main';
import { PreMatchID } from './model/pre';
import { CreateRunResultArgs, FinishState } from './model/runResult';
import { CreateRunResultService } from './service/createRunResult';

export class Controller {
  constructor(private readonly createResult: CreateRunResultService) {}
  async createRunResult(
    matchType: MatchType,
    matchID: PreMatchID | MainMatchID,
    args: Omit<CreateRunResultArgs, 'id'>[]
  ): Promise<Result.Result<Error, void>> {
    const matchResults: Omit<CreateRunResultArgs, 'id'>[] = args.map((m) => {
      return {
        teamID: m.teamID as TeamID,
        points: m.points,
        goalTimeSeconds: m.finishState === 'FINISHED' ? m.goalTimeSeconds : Infinity,
        finishState: m.finishState.toUpperCase() as FinishState,
      };
    });
    const res = await this.createResult.handle(matchType, matchID, matchResults);
    if (Result.isErr(res)) {
      return res;
    }
    return Result.ok(undefined);
  }
}
