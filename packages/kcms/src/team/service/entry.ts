import { Option, Result } from '@mikuroxina/mini-fn';
import { GetMatchService } from '../../match/service/get';
import { TeamRepository } from '../models/repository';
import { Team, TeamID } from '../models/team';

/**
 * 当日参加を行うService
 */
export class EntryService {
  constructor(
    private readonly teamRepository: TeamRepository,
    private readonly preMatch: GetMatchService
  ) {}

  /**
   * チームの出欠を登録します
   * @param teamID 出席するチームのID
   * @returns 出席登録後のチームデータ
   */
  async enter(teamID: TeamID): Promise<Result.Result<Error, Team>> {
    const teamRes = await this.teamRepository.findByID(teamID);
    const matchRes = await this.preMatch.findAllPreMatch();

    if (Result.isOk(matchRes) && matchRes.length > 0) {
      return Result.err(new Error('modify entry'));
    }
    if (Option.isNone(teamRes)) {
      return Result.err(new Error('Team not found'));
    }
    const team = Option.unwrap(teamRes);

    team.enter();
    const res = await this.teamRepository.update(team);
    if (Result.isErr(res)) {
      return Result.err(res[1]);
    }

    return Result.ok(team);
  }

  /**
   * チームの出欠をキャンセルします
   * @param teamID キャンセルするチームのID
   */
  async cancel(teamID: TeamID): Promise<Result.Result<Error, Team>> {
    const teamRes = await this.teamRepository.findByID(teamID);
    const matchRes = await this.preMatch.findAllPreMatch();

    if (Result.isOk(matchRes) && matchRes.length > 0) {
      return Result.err(new Error('modify entry'));
    }
    if (Option.isNone(teamRes)) {
      return Result.err(new Error('Team not found'));
    }
    const team = Option.unwrap(teamRes);

    team.cancelEntry();
    const res = await this.teamRepository.update(team);
    if (Result.isErr(res)) {
      return Result.err(res[1]);
    }

    return Result.ok(team);
  }
}
