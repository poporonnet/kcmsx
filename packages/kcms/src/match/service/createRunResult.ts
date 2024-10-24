import { Option, Result } from '@mikuroxina/mini-fn';
import { MatchType } from 'config';
import { SnowflakeIDGenerator } from '../../id/main';
import { MainMatchID } from '../model/main';
import { PreMatchID } from '../model/pre';
import { MainMatchRepository, PreMatchRepository } from '../model/repository';
import { CreateRunResultArgs, RunResult } from '../model/runResult';

/**
 * 試合の走行結果を複数更新するService
 */
export class CreateRunResultService {
  constructor(
    private readonly idGenerator: SnowflakeIDGenerator,
    private readonly preMatchRepository: PreMatchRepository,
    private readonly mainMatchRepository: MainMatchRepository
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
        await this.mainMatchRepository.update(match);
      } catch (e) {
        return Result.err(e as Error);
      }
    }
    return Result.ok(runResults);
  }
}
