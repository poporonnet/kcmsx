import { Result } from '@mikuroxina/mini-fn';
import { SnowflakeIDGenerator } from '../../id/main';
import { TeamID } from '../../team/models/team';
import { FinishState, RunResult } from '../model/runResult';

/**
 * 走行結果を作成
 */
type MatchResults = {
  teamID: TeamID;
  points: number;
  goalTimeSeconds: number;
  finishState: FinishState;
}[];
export class CreateRunResultService {
  constructor(private readonly idGenerator: SnowflakeIDGenerator) {}
  async handle(matchResults: MatchResults): Promise<Result.Err<Error> | Result.Ok<RunResult[]>> {
    const res: RunResult[] = [];
    for (const m of matchResults) {
      const id = this.idGenerator.generate<RunResult>();
      if (Result.isErr(id)) {
        return Result.err(id[1]);
      }
      const result = RunResult.new({
        id: Result.unwrap(id),
        teamId: m.teamID,
        points: m.points,
        goalTimeSeconds: m.goalTimeSeconds,
        finishState: m.finishState,
      });
      res.push(result);
    }
    return Result.ok(res);
  }
}
