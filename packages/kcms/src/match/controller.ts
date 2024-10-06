import { Result } from "@mikuroxina/mini-fn";
import { MatchType } from "config";
import { SnowflakeIDGenerator } from "../id/main";
import { TeamID } from "../team/models/team";
import { MainMatchID } from "./model/main";
import { PreMatchID } from "./model/pre";
import { MainMatchRepository, PreMatchRepository } from "./model/repository";
import { CreateRunResultArgs, FinishState } from "./model/runResult";
import { CreateRunResultService } from "./service/createRunResult";
type MatchResults = {
  teamID: TeamID;
  points: number;
  goalTimeSeconds: number;
  finishState: FinishState;
}[];
export class Controller {
  private readonly createResult: CreateRunResultService;
  constructor(
    idGenerator: SnowflakeIDGenerator,
    preMatchRepository: PreMatchRepository,
    mainMatchRepository: MainMatchRepository
  ) {
    this.createResult = new CreateRunResultService(
      idGenerator,
      preMatchRepository,
      mainMatchRepository
    );
  }
  async createRunResult(
    matchType: MatchType,
    matchID: PreMatchID | MainMatchID,
    args: Omit<CreateRunResultArgs, "id">[]
  ): Promise<Result.Result<Error, void>> {
    const matchResults: MatchResults = args.map((m) => {
      return {
        teamID: m.teamID as TeamID,
        points: m.points,
        goalTimeSeconds: m.goalTimeSeconds ?? Infinity,
        finishState: m.finishState.toUpperCase() as FinishState,
      };
    });
    const res = await this.createResult.handle(
      matchType,
      matchID,
      matchResults
    );
    if (Result.isErr(res)) {
      return Result.err(res[1]);
    }
    return Result.ok(undefined);
  }
}
