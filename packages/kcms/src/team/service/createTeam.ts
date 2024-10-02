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
    input: Omit<TeamCreateArgs, 'id' | 'isEntered'>
  ): Promise<Result.Result<Error, Team>> {
    const id = this.idGenerator.generate<Team>();
    if (Result.isErr(id)) {
      return Result.err(id[1]);
    }

    // チーム名は重複できない
    if (await this.isTeamNameExists(input.teamName)) {
      return Result.err(new Error('teamName Exists'));
    }

    // チームメンバーの制約
    // 共通: 0人のチームは作れない
    if (input.members.length === 0) {
      return Result.err(new Error('no member'));
    }

    // 最大は2人
    if (input.members.length > 2) {
      return Result.err(new Error('too many members'));
    }

    const createArgs: Omit<TeamCreateArgs, 'isEntered'> = {
      id: id[1],
      teamName: input.teamName,
      members: input.members,
      departmentType: input.departmentType,
      robotType: input.robotType,
    };
    const team = Team.new(createArgs);
    const res = await this.repository.create(team);
    if (Result.isErr(res)) {
      return Result.err(res[1]);
    }

    return Result.ok(res[1]);
  }

  /**
   * チーム名が存在するかを返す
   */
  private async isTeamNameExists(teamName: string) {
    const res = await this.repository.findByTeamName(teamName);
    return Option.isSome(res);
  }
}
