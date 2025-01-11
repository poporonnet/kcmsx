import { Option, Result } from '@mikuroxina/mini-fn';
import { TeamRepository } from '../models/repository';
import { Team, TeamID } from '../models/team';

export class EntryCodeService {
  constructor(private readonly teamRepository: TeamRepository) {}

  /**
   * チームにentryCodeを割り当てます
   * @param teamID entryCodeを割り当てるチームのID
   * @returns entryCode割り当て後のチームデータ
   */
  async assign(teamID: TeamID): Promise<Result.Result<Error, Team>> {
    const teamRes = await this.teamRepository.findByID(teamID);
    if (Option.isNone(teamRes)) {
      return Result.err(new Error('Team not found'));
    }

    const team = Option.unwrap(teamRes);
    // 既にentryCodeが割り当てられている場合はそのまま返す
    if (team.getEntryCode() !== undefined) {
      return Result.ok(teamRes[1]);
    }

    // すでに割り当てられているentryCodeの最大値を取得
    const maxEntryCode = await this.teamRepository.getMaxEntryCode();
    if (Result.isErr(maxEntryCode)) {
      return Result.err(maxEntryCode[1]);
    }

    team.assignEntryCode(Result.unwrap(maxEntryCode) + 1);
    const res = await this.teamRepository.update(team);
    if (Result.isErr(res)) {
      return Result.err(res[1]);
    }
    return Result.ok(team);
  }
}
