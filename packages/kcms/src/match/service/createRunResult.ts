import { Option, Result } from '@mikuroxina/mini-fn';
import { MatchType } from 'config';
import { SnowflakeIDGenerator } from '../../id/main';
import { TeamID } from '../../team/models/team';
import { MainMatch, MainMatchID } from '../model/main';
import { PreMatchID } from '../model/pre';
import { MainMatchRepository, PreMatchRepository } from '../model/repository';
import { CreateRunResultArgs, RunResult } from '../model/runResult';
import { SetMainMatchWinnerService } from './setMainWinner';

/**
 * 試合の走行結果を複数更新するService
 */
export class CreateRunResultService {
  constructor(
    private readonly idGenerator: SnowflakeIDGenerator,
    private readonly preMatchRepository: PreMatchRepository,
    private readonly mainMatchRepository: MainMatchRepository,
    private readonly setMainWinner: SetMainMatchWinnerService
  ) {}

  /**
   *  試合の走行結果を追加します
   * @param matchType {@link MatchType}
   * @param matchID {@link matchID}
   * @param matchResults {@link CreateRunResultArgs}
   */
  async handle(
    matchType: MatchType,
    matchID: PreMatchID | MainMatchID,
    matchResults: Omit<CreateRunResultArgs, 'id'>[]
  ): Promise<Result.Result<Error, RunResult[]>> {
    const runResults: RunResult[] = [];
    for (const m of matchResults) {
      const id = this.idGenerator.generate<RunResult>();
      if (Result.isErr(id)) {
        return id;
      }
      const result = RunResult.new({
        id: Result.unwrap(id),
        teamID: m.teamID,
        points: m.points,
        goalTimeSeconds: m.goalTimeSeconds,
        finishState: m.finishState,
      });
      runResults.push(result);
    }
    if (matchType === 'pre') {
      const matchRes = await this.preMatchRepository.findByID(matchID as PreMatchID);
      if (Option.isNone(matchRes)) {
        return Result.err(new Error('Match not found'));
      }
      const match = Option.unwrap(matchRes);
      try {
        match.appendRunResults(runResults);
        await this.preMatchRepository.update(match);
      } catch (e) {
        return Result.err(e as Error);
      }
    } else {
      const matchRes = await this.mainMatchRepository.findByID(matchID as MainMatchID);
      if (Option.isNone(matchRes)) {
        return Result.err(new Error('Match not found'));
      }
      const match = Option.unwrap(matchRes);
      try {
        match.appendRunResults(runResults);
        const winnerRes = this.decideWinner(match);
        if (Option.isSome(winnerRes)) {
          this.setMainWinner.handle(match.getID(), Option.unwrap(winnerRes));
        }
      } catch (e) {
        return Result.err(e as Error);
      }
    }
    return Result.ok(runResults);
  }

  decideWinner(match: MainMatch): Option.Option<TeamID> {
    if (match.getRunResults().length !== 4) return Option.none();

    // 全ての結果を見て、点数を足す
    const results = match.getRunResults();
    const team1Id = match.getTeamID1()!;
    const team2Id = match.getTeamID2()!;

    const team1Results = results.filter((r) => r.getTeamID() === team1Id);
    const team2Results = results.filter((r) => r.getTeamID() === team2Id);

    const team1Points = team1Results.reduce((acc, cur) => acc + cur.getPoints(), 0);
    const team2Points = team2Results.reduce((acc, cur) => acc + cur.getPoints(), 0);

    // 大きい方を勝者にする
    if (team1Points > team2Points) {
      return Option.some(team1Id);
    } else if (team2Points > team1Points) {
      return Option.some(team2Id);
    }

    // もし同じならば、ベストタイムが早い方を勝者にする
    const team1BestTime = team1Results.reduce((min, result) => {
      const goalTime = result.getGoalTimeSeconds();
      return goalTime < min ? goalTime : min;
    }, Infinity);
    const team2BestTime = team2Results.reduce((min, result) => {
      const goalTime = result.getGoalTimeSeconds();
      return goalTime < min ? goalTime : min;
    }, Infinity);

    if (team1BestTime < team2BestTime) {
      return Option.some(team1Id);
    } else if (team2BestTime < team1BestTime) {
      return Option.some(team2Id);
    }

    // それでも同じならば、勝者は自動決定できない
    return Option.none();
  }
}
