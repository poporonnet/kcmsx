import { TeamRepository } from '../models/repository.js';
import { Team, TeamCreateArgs } from '../models/team.js';
import { Option, Result } from '@mikuroxina/mini-fn';
import { SnowflakeIDGenerator } from '../../id/main.js';

export class CreateTeamService {
  private readonly repository: TeamRepository;
  private readonly idGenerator: SnowflakeIDGenerator;

  constructor(repository: TeamRepository, idGenerator: SnowflakeIDGenerator) {
    this.repository = repository;
    this.idGenerator = idGenerator;
  }

  /**
   * チームを作成(参加登録)します\
   * - チーム名は重複できない
   * - チームのメンバー数は最大2人
   * @param input {@link TeamCreateArgs} チームのデータ
   */
  async create(
    input: Omit<TeamCreateArgs, 'id' | 'isEntered'>[]
  ): Promise<Result.Result<Error, Team[]>> {
    const res: Team[] = [];

    for (const v of input) {
      const id = this.idGenerator.generate<Team>();
      if (Result.isErr(id)) {
        return Result.err(id[1]);
      }

      // チーム名は重複できない
      if (await this.isTeamNameExists(v.teamName)) {
        return Result.err(new Error('teamName Exists'));
      }

      // チームメンバーの制約
      // 共通: 0人のチームは作れない
      if (v.members.length === 0) {
        return Result.err(new Error('no member'));
      }

      // 最大は2人
      if (v.members.length > 2) {
        return Result.err(new Error('too many members'));
      }

      const createArgs: Omit<TeamCreateArgs, 'isEntered'> = {
        id: id[1],
        teamName: v.teamName,
        members: v.members,
        departmentType: v.departmentType,
        clubName: v.clubName,
        robotType: v.robotType,
      };
      const team = Team.new(createArgs);
      const teamRes = await this.repository.create(team);
      if (Result.isErr(teamRes)) {
        return Result.err(teamRes[1]);
      }

      res.push(team);
    }
    return Result.ok(res);
  }

  /**
   * チーム名が存在するかを返す
   */
  private async isTeamNameExists(teamName: string) {
    const res = await this.repository.findByTeamName(teamName);
    return Option.isSome(res);
  }
}
