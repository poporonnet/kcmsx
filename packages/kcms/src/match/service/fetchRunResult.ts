import { MatchType } from 'config';
import { RunResult } from '../model/runResult';
import { MainMatchID } from '../model/main';
import { PreMatchID } from '../model/pre';
import { Option, Result } from '@mikuroxina/mini-fn';
import { MainMatchRepository, PreMatchRepository } from '../model/repository';

export class FetchRunResultService {
  constructor(
    private readonly mainMatchRepository: MainMatchRepository,
    private readonly preMatchRepository: PreMatchRepository
  ) {}
  async fetch(
    matchType: MatchType,
    matchID: MainMatchID | PreMatchID
  ): Promise<Result.Result<Error, RunResult[]>> {
    const mainMatchRes = await this.mainMatchRepository.findByID(matchID as MainMatchID);
    if (Option.isSome(mainMatchRes)) {
      const mainMatch = Option.unwrap(mainMatchRes);
      return Result.ok(mainMatch.getRunResults());
    }
    
    const preMatchRes = await this.preMatchRepository.findByID(matchID as PreMatchID);
    if (Option.isSome(preMatchRes)) {
      const preMatch = Option.unwrap(preMatchRes);
      return Result.ok(preMatch.getRunResults());
    }

    return Result.err(new Error('Match not found'));
  }
}
