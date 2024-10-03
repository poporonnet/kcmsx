import { TeamRepository } from '../../models/repository';
import { Team, TeamID } from '../../models/team';
import { Option, Result } from '@mikuroxina/mini-fn';
import { Prisma, PrismaClient } from '@prisma/client';
import { DepartmentType } from 'config';

export class PrismaTeamRepository implements TeamRepository {
  constructor(private readonly client: PrismaClient) {}

  private deserialize(data: Prisma.PromiseReturnType<typeof this.client.team.findUnique>): Team {
    if (!data) throw new Error('invalid data');

    return Team.reconstruct({
      id: data.id as TeamID,
      teamName: data.name,
      // ToDo: メンバーをどう扱うかを決める
      members: [],
      departmentType: data.department as DepartmentType,
      // ToDo: RobotTypeを入れる(Teamモデルにメンバーを追加する)
      robotType: 'leg',
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
          department: team.getDepartmentType(),
          clubName: team.getClubName(),
          isEntered: team.getIsEntered(),
          // ToDo: RobotTypeを入れる(Teamモデルにメンバーを追加する)
          robotType: '',
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

  async findByTeamName(): Promise<Option.Option<Team>> {
    // ToDo: Team.name を @uniqueにする
    throw new Error('Method not implemented.');
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