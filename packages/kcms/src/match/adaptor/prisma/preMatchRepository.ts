import { PreMatchRepository } from '../../model/repository';
import { PreMatch, PreMatchID } from '../../model/pre';
import { Option, Result } from '@mikuroxina/mini-fn';
import type { Prisma, PrismaClient } from '@prisma/client';
import { TeamID } from '../../../team/models/team';
import { RunResult, RunResultID } from '../../model/runResult';

export class PrismaPreMatchRepository implements PreMatchRepository {
  constructor(private readonly client: PrismaClient) {}

  private deserialize(
    res: Prisma.PromiseReturnType<
      typeof this.client.preMatch.findMany<{ include: { runResult: true } }>
    >
  ): PreMatch[] {
    if (!res) {
      throw new Error('invalid data');
    }

    return res.map((data) =>
      PreMatch.new({
        id: data.id as PreMatchID,
        courseIndex: data.courseIndex,
        matchIndex: data.matchIndex,
        teamId1: data.leftTeamID != undefined ? (data.leftTeamID as TeamID) : undefined,
        teamId2: data.rightTeamID != undefined ? (data.rightTeamID as TeamID) : undefined,
        runResults: data.runResult.map((v) =>
          RunResult.new({
            id: v.id as RunResultID,
            teamId: v.teamID as TeamID,
            points: v.points,
            goalTimeSeconds: v.goalTimeSeconds,
            finishState: v.finishState === 0 ? 'GOAL' : 'FINISHED',
          })
        ),
      })
    );
  }

  async create(match: PreMatch): Promise<Result.Result<Error, void>> {
    try {
      await this.client.preMatch.create({
        data: {
          id: match.getId(),
          courseIndex: match.getCourseIndex(),
          matchIndex: match.getMatchIndex(),
          leftTeamID: match.getTeamId1(),
          rightTeamID: match.getTeamId2(),
        },
      });
      return Result.ok(undefined);
    } catch (e) {
      return Result.err(e as Error);
    }
  }

  async createBulk(matches: PreMatch[]): Promise<Result.Result<Error, void>> {
    try {
      await this.client.preMatch.createMany({
        data: matches.map((v) => {
          return {
            id: v.getId(),
            courseIndex: v.getCourseIndex(),
            matchIndex: v.getMatchIndex(),
            leftTeamID: v.getTeamId1(),
            rightTeamID: v.getTeamId2(),
          };
        }),
      });

      return Result.ok(undefined);
    } catch (e) {
      return Result.err(e as Error);
    }
  }

  async findAll(): Promise<Result.Result<Error, PreMatch[]>> {
    try {
      const res = await this.client.preMatch.findMany({
        include: {
          runResult: true,
        },
      });

      return Result.ok(this.deserialize(res));
    } catch (e) {
      return Result.err(e as Error);
    }
  }

  async findByID(id: PreMatchID): Promise<Option.Option<PreMatch>> {
    try {
      const res = await this.client.preMatch.findUnique({
        where: {
          id: id,
        },
        include: {
          runResult: true,
        },
      });
      if (!res) return Option.none();

      return Option.some(this.deserialize([res])[0]);
    } catch {
      return Option.none();
    }
  }

  async update(match: PreMatch): Promise<Result.Result<Error, void>> {
    try {
      await this.client.preMatch.update({
        where: {
          id: match.getId(),
        },
        data: {
          courseIndex: match.getCourseIndex(),
          matchIndex: match.getMatchIndex(),
          leftTeamID: match.getTeamId1(),
          rightTeamID: match.getTeamId2(),
          runResult: {
            updateMany: match.getRunResults().map((v) => {
              return {
                where: {
                  id: v.getId(),
                },
                data: {
                  id: v.getId(),
                  teamID: v.getTeamId(),
                  points: v.getPoints(),
                  goalTimeSeconds: v.getGoalTimeSeconds(),
                  // NOTE: GOAL: 0 , FINISHED: 1
                  finishState: v.isGoal() ? 0 : 1,
                },
              };
            }),
          },
        },
      });
      return Result.ok(undefined);
    } catch (e) {
      return Result.err(e as Error);
    }
  }
}
