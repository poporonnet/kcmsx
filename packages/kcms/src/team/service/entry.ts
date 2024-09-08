import { TeamRepository } from '../models/repository';
import { Team, TeamID } from '../models/team';
import { Option, Result } from '@mikuroxina/mini-fn';

/**
 * 当日参加を行うService
 */
export class EntryService {
  constructor(private readonly teamRepository: TeamRepository) {}

  /**
   * チームの出欠を登録します
   * @param teamID 出席するチームのID
   * @returns 出席登録後のチームデータ
   */
  async enter(teamID: TeamID): Promise<Result.Result<Error, Team>> {
    const teamRes = await this.teamRepository.findByID(teamID);
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
    if (Option.isNone(teamRes)) {
      return Result.err(new Error('Team not found'));
    }
    const team = Option.unwrap(teamRes);

    team.cancel();
    const res = await this.teamRepository.update(team);
    if (Result.isErr(res)) {
      return Result.err(res[1]);
    }

    return Result.ok(team);
  }
}
