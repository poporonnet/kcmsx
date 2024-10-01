import { TeamRepository } from './models/repository.js';
import { CreateTeamService } from './service/createTeam';
import { Result, Option } from '@mikuroxina/mini-fn';
import { FetchTeamService } from './service/fetch';
import { DeleteEntryService } from './service/delete.js';
import { SnowflakeIDGenerator } from '../id/main.js';
import { z } from 'zod';
import { GetTeamsResponseSchema, PostTeamsResponseSchema } from './adaptor/validator/team';
import { DepartmentType, RobotType } from 'config';

export class Controller {
  private readonly createTeam: CreateTeamService;
  private readonly findEntry: FetchTeamService;
  private readonly deleteService: DeleteEntryService;

  constructor(repository: TeamRepository) {
    this.createTeam = new CreateTeamService(
      repository,
      new SnowflakeIDGenerator(1, () => BigInt(new Date().getTime()))
    );
    this.findEntry = new FetchTeamService(repository);
    this.deleteService = new DeleteEntryService(repository);
  }

  /**
   * @description チームを作成する
   * ToDo: 複数チームを同時に作成できるようにする
   */
  async create(args: {
    teamName: string;
    members: string[];
    robotType: RobotType;
    departmentType: DepartmentType;
    clubName?: string;
  }): Promise<Result.Result<Error, z.infer<typeof PostTeamsResponseSchema>>> {
    const res = await this.createTeam.create(args);
    if (Result.isErr(res)) {
      return res;
    }

    const team = Result.unwrap(res);
    return Result.ok([
      {
        id: team.getId(),
        name: team.getTeamName(),
        // ToDo: ゼッケン番号(エントリーコード)を取り出す
        entryCode: '0',
        // FIXME: スキーマが[string, ...string[]]と推論されてしまうので、とりあえずアサーションで対応
        members: team.getMembers() as [string, ...string[]],
        clubName: team.getClubName() ?? '',
        category: team.getDepartmentType(),
        robotType: team.getRobotType(),
        isEntered: team.getIsEntered(),
      },
    ]);
  }

  /**
   * @description 全チームを取得
   * @returns 全てのチームの配列
   */
  async get(): Promise<Result.Result<Error, z.infer<typeof GetTeamsResponseSchema>>> {
    const res = await this.findEntry.findAll();
    if (Result.isErr(res)) {
      return res;
    }

    return Result.ok({
      teams: Result.unwrap(res).map((v) => {
        return {
          id: v.getId(),
          name: v.getTeamName(),
          // ToDo: ゼッケン番号(エントリーコード)を取り出す
          entryCode: '0',
          // FIXME: スキーマが[string, ...string[]]と推論されてしまうので、とりあえずアサーションで対応
          members: v.getMembers() as [string, ...string[]],
          clubName: v.getClubName() ?? '',
          robotType: v.getRobotType(),
          category: v.getDepartmentType(),
          isEntered: v.getIsEntered(),
        };
      }),
    });
  }

  /**
   * @description 指定したIDのチームを削除する
   */
  async delete(id: string): Promise<Option.Option<Error>> {
    const res = await this.deleteService.handle(id);
    if (Option.isSome(res)) {
      return Option.some(res[1]);
    }

    return Option.none();
  }
}
