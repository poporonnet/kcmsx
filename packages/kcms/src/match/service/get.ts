import { Option, Result } from '@mikuroxina/mini-fn';
import { MainMatchRepository, PreMatchRepository } from '../model/repository.js';
import { PreMatch, PreMatchID } from '../model/pre.js';
import { MainMatch, MainMatchID } from '../model/main.js';

// ToDo: 試合の走行結果の取得を実装する (別Serviceにしても良いかもしれない)
export class GetMatchService {
  constructor(
    private readonly preMatchRepository: PreMatchRepository,
    private readonly mainMatchRepository: MainMatchRepository
  ) {}

  /**
   * @description 試合を取得 ※preMatch -> MainMatchの順に取得し、どちらも存在しない場合はエラーを返す
   * @param id
   */
  async findById(
    id: PreMatchID | MainMatchID
  ): Promise<Result.Result<Error, PreMatch | MainMatch>> {
    const preRes = await this.preMatchRepository.findByID(id as PreMatchID);
    if (Option.isSome(preRes)) {
      return Result.ok(Option.unwrap(preRes));
    }

    const mainRes = await this.mainMatchRepository.findByID(id as MainMatchID);
    if (Option.isSome(mainRes)) {
      return Result.ok(Option.unwrap(mainRes));
    }

    return Result.err(new Error('Not found'));
  }

  /**
   * @description 全ての予選試合を取得
   * @returns 予選試合のリスト
   */
  async findAllPreMatch(): Promise<Result.Result<Error, PreMatch[]>> {
    return await this.preMatchRepository.findAll();
  }

  /**
   * @description 全ての本戦試合を取得
   * @returns 本戦試合のリスト
   */
  async findAllMainMatch(): Promise<Result.Result<Error, MainMatch[]>> {
    return await this.mainMatchRepository.findAll();
  }

  /**
   * @description 全ての試合を取得
   * @returns 全試合のリスト
   */
  async findAll(): Promise<Result.Result<Error, { main: MainMatch[]; pre: PreMatch[] }>> {
    const mainRes = await this.mainMatchRepository.findAll();
    if (Result.isErr(mainRes)) {
      return mainRes;
    }
    const main = Result.unwrap(mainRes);

    const preRes = await this.preMatchRepository.findAll();
    if (Result.isErr(preRes)) {
      return preRes;
    }
    const pre = Result.unwrap(preRes);

    return Result.ok({ main, pre });
  }
}
