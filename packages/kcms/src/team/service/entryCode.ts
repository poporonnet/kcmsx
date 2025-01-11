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
  async setEntryCode(teamID: TeamID): Promise<Result.Result<Error, Team>> {
    const teamRes = await this.teamRepository.findByID(teamID);
    if (Option.isNone(teamRes)) {
      return Result.err(new Error('Team not found'));
    }
    const team = Option.unwrap(teamRes);
    const entryCodeRes = team.setEntryCode(await this.nextEntryCode());
    if (Result.isErr(entryCodeRes)) {
      return entryCodeRes;
    }

    const res = await this.teamRepository.update(team);
    if (Result.isErr(res)) {
      return Result.err(res[1]);
    }

    return Result.ok(team);
  }

  /**
   * すでに割り当てられているentryCodeの最大値を取得し、次のentryCodeを返す
   * @returns 次のentryCode
   *  */
  private async nextEntryCode(): Promise<number> {
    const teamsRes = await this.teamRepository.findAll();
    const teams = Result.unwrap(teamsRes);
    const entoryCodes = teams.map((t) => t.getEntryCode() ?? 0);
    const maxEntryCode = entoryCodes.length === 0 ? 0 : entoryCodes.sort((a, b) => b - a)[0];
    return maxEntryCode + 1;
  }
}
