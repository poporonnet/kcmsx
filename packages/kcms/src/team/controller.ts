import { TeamRepository } from './models/repository.js';
import { CreateTeamService } from './service/createTeam';
import { Option, Result } from '@mikuroxina/mini-fn';
import { FetchTeamService } from './service/get.js';
import { DeleteEntryService } from './service/delete.js';
import { SnowflakeIDGenerator } from '../id/main.js';
import {
  GetTeamsResponseSchema,
  PostTeamsRequestSchema,
  PostTeamsResponseSchema,
} from './adaptor/validator/team';
import { z } from '@hono/zod-openapi';

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

  async create(
    args: z.infer<typeof PostTeamsRequestSchema>
  ): Promise<Result.Result<Error, z.infer<typeof PostTeamsResponseSchema>>> {
    const res = await this.createTeam.create(
      args.map((v) => {
        return {
          teamName: v.name,
          members: v.members,
          departmentType: v.departmentType,
          robotType: v.robotType,
          clubName: v.clubName,
        };
      })
    );
    if (Result.isErr(res)) {
      return Result.err(res[1]);
    }

    const unwrapped = Result.unwrap(res);
    return Result.ok(
      unwrapped.map((v) => {
        return {
          id: v.getId(),
          name: v.getTeamName(),
          members: v.getMembers() as [string, ...string[]],
          clubName: v.getClubName() ?? '',
          entryCode: '',
          robotType: v.getRobotType(),
          departmentType: v.getDepartmentType(),
          isEntered: v.getIsEntered(),
        };
      })
    );
  }

  async get(): Promise<Result.Result<Error, z.infer<typeof GetTeamsResponseSchema>>> {
    const res = await this.findEntry.findAll();
    if (Result.isErr(res)) {
      return Result.err(res[1]);
    }
    const teams = Result.unwrap(res);

    return Result.ok({
      teams: teams.map((v) => {
        return {
          id: v.getId(),
          name: v.getTeamName(),
          members: v.getMembers() as [string, ...string[]],
          clubName: v.getClubName() ?? '',
          entryCode: '',
          robotType: v.getRobotType(),
          departmentType: v.getDepartmentType(),
          isEntered: v.getIsEntered(),
        };
      }),
    });
  }

  async delete(id: string): Promise<Option.Option<Error>> {
    const res = await this.deleteService.handle(id);
    if (Option.isSome(res)) {
      return Option.some(res[1]);
    }

    return Option.none();
  }
}
