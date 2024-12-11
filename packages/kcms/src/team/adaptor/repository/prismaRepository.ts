import { Option, Result } from '@mikuroxina/mini-fn';
import { Prisma, PrismaClient } from '@prisma/client';
import { DepartmentType, RobotType } from 'config';
import { TeamRepository } from '../../models/repository';
import { Team, TeamID } from '../../models/team';

export class PrismaTeamRepository implements TeamRepository {
  constructor(private readonly client: PrismaClient) {}

  private deserialize(data: Prisma.PromiseReturnType<typeof this.client.team.findUnique>): Team {
    if (!data) throw new Error('invalid data');

    return Team.reconstruct({
      id: data.id as TeamID,
      teamName: data.name,
      members: JSON.parse(data.members),
      departmentType: data.department as DepartmentType,
      robotType: data.robotType as RobotType,
      clubName: data.clubName ?? undefined,
      isEntered: data.isEntered,
    });
  }

  async create(team: Team): Promise<Result.Result<Error, Team>> {
    try {
      const res = await this.client.team.create({
        data: {
          id: team.getId(),
          name: team.getTeamName(),
          members: JSON.stringify(team.getMembers()),
          department: team.getDepartmentType(),
          clubName: team.getClubName(),
          isEntered: team.getIsEntered(),
          robotType: team.getRobotType(),
        },
      });
      return Result.ok(this.deserialize(res));
    } catch (e) {
      return Result.err(e as Error);
    }
  }

  async delete(id: string): Promise<Option.Option<Error>> {
    try {
      await this.client.team.delete({
        where: {
          id: id,
        },
      });
      return Option.none();
    } catch (e) {
      return Option.some(e as Error);
    }
  }

  async findAll(): Promise<Result.Result<Error, Team[]>> {
    try {
      const res = await this.client.team.findMany();
      return Result.ok(res.map((v) => this.deserialize(v)));
    } catch (e) {
      return Result.err(e as Error);
    }
  }

  async findByID(id: string): Promise<Option.Option<Team>> {
    try {
      const res = await this.client.team.findUnique({
        where: {
          id: id,
        },
      });
      return Option.some(this.deserialize(res));
    } catch {
      return Option.none();
    }
  }

  async findByTeamName(name: string): Promise<Option.Option<Team>> {
    try {
      const res = await this.client.team.findUnique({
        where: {
          name: name,
        },
      });

      return Option.some(this.deserialize(res));
    } catch {
      return Option.none();
    }
  }

  async update(team: Team): Promise<Result.Result<Error, Team>> {
    try {
      const res = await this.client.team.update({
        where: {
          id: team.getId(),
        },
        data: {
          isEntered: team.getIsEntered(),
        },
      });
      return Result.ok(this.deserialize(res));
    } catch (e) {
      return Result.err(e as Error);
    }
  }
}
