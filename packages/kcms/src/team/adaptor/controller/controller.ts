import { z } from '@hono/zod-openapi';
import { Result } from '@mikuroxina/mini-fn';
import { TeamID } from '../../models/team';
import { CreateTeamService } from '../../service/createTeam';
import { DeleteTeamService } from '../../service/delete';
import { EntryService } from '../../service/entry';
import { FetchTeamService } from '../../service/get';
import {
  GetTeamResponseSchema,
  GetTeamsResponseSchema,
  PostTeamsRequestSchema,
  PostTeamsResponseSchema,
} from '../validator/team';

export class TeamController {
  constructor(
    private readonly createTeam: CreateTeamService,
    private readonly findTeam: FetchTeamService,
    private readonly deleteTeam: DeleteTeamService,
    private readonly entry: EntryService
  ) {}

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

  async getAll(): Promise<Result.Result<Error, z.infer<typeof GetTeamsResponseSchema>>> {
    const res = await this.findTeam.findAll();
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

  async getByID(id: TeamID): Promise<Result.Result<Error, z.infer<typeof GetTeamResponseSchema>>> {
    const res = await this.findTeam.findByID(id);
    if (Result.isErr(res)) {
      return Result.err(res[1]);
    }
    const team = Result.unwrap(res);

    return Result.ok({
      id: team.getId(),
      name: team.getTeamName(),
      members: team.getMembers() as [string, ...string[]],
      clubName: team.getClubName() ?? '',
      entryCode: '',
      robotType: team.getRobotType(),
      departmentType: team.getDepartmentType(),
      isEntered: team.getIsEntered(),
    });
  }

  async delete(id: TeamID): Promise<Result.Result<Error, void>> {
    const res = await this.deleteTeam.handle(id);
    if (Result.isErr(res)) {
      return Result.err(res[1]);
    }

    return Result.ok(undefined);
  }

  async enter(id: TeamID): Promise<Result.Result<Error, void>> {
    const res = await this.entry.enter(id);
    if (Result.isErr(res)) {
      return Result.err(res[1]);
    }
    return Result.ok(undefined);
  }
}