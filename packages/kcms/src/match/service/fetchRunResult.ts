import { Option, Result } from '@mikuroxina/mini-fn';
import { MatchType } from 'config';
import { MainMatchID } from '../model/main';
import { PreMatchID } from '../model/pre';
import { MainMatchRepository, PreMatchRepository } from '../model/repository';
import { RunResult } from '../model/runResult';

export class FetchRunResultService {
  constructor(
    private readonly mainMatchRepository: MainMatchRepository,
    private readonly preMatchRepository: PreMatchRepository
  ) {}
  async handle(
    matchType: MatchType,
    matchID: MainMatchID | PreMatchID
  ): Promise<Result.Result<Error, RunResult[]>> {
    if (matchType === 'main') {
      const mainMatchRes = await this.mainMatchRepository.findByID(matchID as MainMatchID);
      if (Option.isNone(mainMatchRes)) {
        return Result.err(new Error('MainMatch not found'));
      }
      const mainMatch = Option.unwrap(mainMatchRes);
      return Result.ok(mainMatch.getRunResults());
    } else {
      const preMatchRes = await this.preMatchRepository.findByID(matchID as PreMatchID);
      if (Option.isNone(preMatchRes)) {
        return Result.err(new Error('PreMatch not found'));
      }
      const preMatch = Option.unwrap(preMatchRes);
      return Result.ok(preMatch.getRunResults());
    }
  }
}
