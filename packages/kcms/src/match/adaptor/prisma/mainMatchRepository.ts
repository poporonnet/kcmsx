import { MainMatchRepository } from '../../model/repository';
import { MainMatch, MainMatchID } from '../../model/main';
import { Option, Result } from '@mikuroxina/mini-fn';
import type { Prisma, PrismaClient } from '@prisma/client';
import { TeamID } from '../../../team/models/team';
import { RunResult, RunResultID } from '../../model/runResult';

export class PrismaMainMatchRepository implements MainMatchRepository {
  constructor(private readonly client: PrismaClient) {}

  private deserialize(
    res: Prisma.PromiseReturnType<
      typeof this.client.mainMatch.findMany<{ include: { runResult: true } }>
    >
  ): MainMatch[] {
    if (!res) {
      throw new Error('invalid data');
    }

    return res.map((data) =>
      MainMatch.new({
        id: data.id as MainMatchID,
        courseIndex: data.courseIndex,
        matchIndex: data.matchIndex,
        teamId1: (data.leftTeamId as TeamID) ?? undefined,
        teamId2: (data.rightTeamId as TeamID) ?? undefined,
        winnerId: (data.winnerTeamId as TeamID) ?? undefined,
        runResults: data.runResult.map((v) =>
          RunResult.new({
            id: v.id as RunResultID,
            teamId: v.teamID as TeamID,
            points: v.points,
            goalTimeSeconds: v.goalTimeSeconds,
            // NOTE: GOAL: 0 , FINISHED: 1
            finishState: v.finishState === 0 ? 'GOAL' : 'FINISHED',
          })
        ),
      })
    );
  }

  async create(match: MainMatch): Promise<Result.Result<Error, void>> {
    try {
      await this.client.mainMatch.create({
        data: {
          id: match.getId(),
          courseIndex: match.getCourseIndex(),
          matchIndex: match.getMatchIndex(),
          leftTeamId: match.getTeamId1(),
          rightTeamId: match.getTeamId2(),
        },
      });

      return Result.ok(undefined);
    } catch (e) {
      return Result.err(e as Error);
    }
  }

  async createBulk(matches: MainMatch[]): Promise<Result.Result<Error, void>> {
    try {
      await this.client.mainMatch.createMany({
        data: matches.map((v) => {
          return {
            id: v.getId(),
            courseIndex: v.getCourseIndex(),
            matchIndex: v.getMatchIndex(),
            leftTeamId: v.getTeamId1(),
            rightTeamId: v.getTeamId2(),
          };
        }),
      });

      return Result.ok(undefined);
    } catch (e) {
      return Result.err(e as Error);
    }
  }

  async findAll(): Promise<Result.Result<Error, MainMatch[]>> {
    try {
      const res = await this.client.mainMatch.findMany({ include: { runResult: true } });
      return Result.ok(this.deserialize(res));
    } catch (e) {
      return Result.err(e as Error);
    }
  }

  async findByID(id: MainMatchID): Promise<Option.Option<MainMatch>> {
    try {
      const res = await this.client.mainMatch.findUnique({
        where: {
          id: id,
        },
        include: {
          runResult: true,
        },
      });
      if (!res) {
        return Option.none();
      }

      return Option.some(this.deserialize([res])[0]);
    } catch {
      return Option.none();
    }
  }

  async update(match: MainMatch): Promise<Result.Result<Error, void>> {
    try {
      await this.client.mainMatch.update({
        where: {
          id: match.getId(),
        },
        data: {
          courseIndex: match.getCourseIndex(),
          matchIndex: match.getMatchIndex(),
          leftTeamId: match.getTeamId1(),
          rightTeamId: match.getTeamId2(),
          winnerTeamId: match.getWinnerId(),
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
