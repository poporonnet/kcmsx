import { z } from '@hono/zod-openapi';
import { Result } from '@mikuroxina/mini-fn';
import { SnowflakeIDGenerator } from '../id/main';
import { TeamID } from '../team/models/team';
import { PostMatchRunResultRequestSchema } from './adaptor/validator/match';
import { FinishState } from './model/runResult';
import { CreateRunResultService } from './service/createRunResult';
type MatchResults = {
  teamID: TeamID;
  points: number;
  goalTimeSeconds: number;
  finishState: FinishState;
}[];
export class Controller {
  private readonly createRunResult: CreateRunResultService;
  constructor() {
    this.createRunResult = new CreateRunResultService(
      new SnowflakeIDGenerator(1, () => BigInt(new Date().getTime()))
    );
  }
  async create(args: z.infer<typeof PostMatchRunResultRequestSchema>) {
    const matchResults = args.map((m) => {
      return {
        teamID: m.teamID as TeamID,
        points: m.points,
        goalTimeSeconds: m.goalTimeSeconds ? m.goalTimeSeconds : Infinity,
        finishState: m.finishState.toUpperCase() as FinishState,
      };
    }) as MatchResults;
    const res = await this.createRunResult.handle(matchResults);
    if (Result.isErr(res)) {
      return Result.err(res[1]);
    }
    const unwrapped = Result.unwrap(res);
    return Result.ok(
      unwrapped.map((m) => {
        return {
          id: m.getId(),
          teamID: m.getTeamId(),
          points: m.getPoints(),
          goalTimeSeconds: m.getGoalTimeSeconds(),
          isGoal: m.isGoal(),
          isFinite: m.isFinished(),
        };
      })
    );
  }
}
