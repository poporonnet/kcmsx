import { Result } from '@mikuroxina/mini-fn';
import { MatchType } from 'config';
import { MainMatchID } from './model/main';
import { PreMatchID } from './model/pre';
import { CreateRunResultArgs } from './model/runResult';
import { CreateRunResultService } from './service/createRunResult';
export class Controller {
  constructor(private readonly createResult: CreateRunResultService) {}
  async createRunResult(
    matchType: MatchType,
    matchID: PreMatchID | MainMatchID,
    args: Omit<CreateRunResultArgs, 'id'>[]
  ): Promise<Result.Result<Error, void>> {
    const matchResults: Omit<CreateRunResultArgs, 'id'>[] = args.map((m) => {
      // Finishedの場合、goalTimeSecondsはInfinityでなくてはならない
      if (m.finishState === 'FINISHED' && m.goalTimeSeconds !== Infinity) {
        Result.err(args);
      }
      return {
        ...m,
      };
    });
    const res = await this.createResult.handle(matchType, matchID, matchResults);
    if (Result.isErr(res)) {
      return res;
    }
    return Result.ok(undefined);
  }
}
