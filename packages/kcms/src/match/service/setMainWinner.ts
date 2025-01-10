import { Option, Result } from '@mikuroxina/mini-fn';
import { TeamID } from '../../team/models/team';
import { MainMatchID } from '../model/main';
import { MainMatchRepository } from '../model/repository';

export class SetMainMatchWinnerService {
  constructor(private readonly mainMatchRepository: MainMatchRepository) {}

  async handle(matchID: MainMatchID, winnerID: TeamID): Promise<Result.Result<Error, void>> {
    const matchRes = await this.mainMatchRepository.findByID(matchID);
    if (Option.isNone(matchRes)) {
      return Result.err(new Error('Match not found'));
    }
    const match = Option.unwrap(matchRes);

    try {
      match.setWinnerID(winnerID);
    } catch (e) {
      return Result.err(e as unknown as Error);
    }

    const matchUpdateRes = await this.mainMatchRepository.update(match);
    if (Result.isErr(matchUpdateRes)) {
      return matchUpdateRes;
    }

    // note: 決勝なら親がいないため、ここで終了
    const parentID = match.getParentID();
    if (!parentID) {
      return Result.ok(undefined);
    }

    // 親の試合を取得し、もう片方の試合情報を取り出す
    const parentMatchRes = await this.mainMatchRepository.findByID(parentID);
    if (Option.isNone(parentMatchRes)) {
      return Result.err(new Error('Parent match not found'));
    }
    const parentMatch = Option.unwrap(parentMatchRes);

    const childMatches = parentMatch.getChildMatches();
    // none: 親の子は必ず存在するのでnon-null assertionを使う
    const otherMatch =
      childMatches!.match1.getID() === matchID ? childMatches!.match2 : childMatches!.match1;

    // もう片方の試合が終了していない場合は終了
    const otherWinnerID = otherMatch.getWinnerID();
    if (!otherWinnerID) {
      return Result.ok(undefined);
    }

    // もう片方も終わっているなら、親試合のチームにそれぞれの勝者を設定する
    try {
      parentMatch.setTeams(winnerID, otherWinnerID);
    } catch (e) {
      return Result.err(e as unknown as Error);
    }

    const parentMatchUpdateRes = await this.mainMatchRepository.update(parentMatch);
    if (Result.isErr(parentMatchUpdateRes)) {
      return parentMatchUpdateRes;
    }

    return Result.ok(undefined);
  }
}
