import { Option, Result } from "@mikuroxina/mini-fn";
import type { Prisma, PrismaClient } from "@prisma/client";
import { DepartmentType } from "config";
import { TeamID } from "../../../team/models/team";
import { ChildrenMatches, MainMatch, MainMatchID } from "../../model/main";
import { MainMatchRepository } from "../../model/repository";
import { RunResult, RunResultID } from "../../model/runResult";

export class PrismaMainMatchRepository implements MainMatchRepository {
  constructor(private readonly client: PrismaClient) {
  }

  //sqliteのIntegerにはInfinityを入れられないため十分に大きい整数に変換する
  private readonly INT32MAX: number = 2147483647;

  private async deserialize(
    res: Prisma.PromiseReturnType<
      typeof this.client.mainMatch.findMany<{
        include: {
          runResult: true;
          childrenRight: true;
          childrenLeft: true;
          parent1: true;
          parent2: true;
        };
      }>
    >,
  ): Promise<MainMatch[]> {
    if (!res) {
      throw new Error("invalid data");
    }

    return res.map((data) => {
      const childrenMatches = (): ChildrenMatches | undefined => {
        // NOTE: left/rightは1つずつしかないので0番目を取る
        const childrenMatch1 = data.childrenLeft ?? undefined;
        const childrenMatch2 = data.childrenRight ?? undefined;
        // NOTE: left/rightが両方存在しない場合(まだ生成されていない状態)はundefinedを返す
        if (!childrenMatch1 && !childrenMatch2) {
          return undefined;
        }
        // NOTE: どちらかが存在しない場合は本来エラーだが、取り敢えずundefinedを返しておく
        // TODO: ここをエラーにする
        if (!childrenMatch1 || !childrenMatch2) {
          return undefined;
        }

        return {
          match1: MainMatch.new({
            id: childrenMatch1.id as MainMatchID,
            courseIndex: childrenMatch1.courseIndex,
            matchIndex: childrenMatch1.matchIndex,
            departmentType: childrenMatch1.departmentType as DepartmentType,
            teamId1: (childrenMatch1.leftTeamId as TeamID) ?? undefined,
            teamId2: (childrenMatch1.rightTeamId as TeamID) ?? undefined,
            winnerId: (childrenMatch1.winnerTeamId as TeamID) ?? undefined,
            runResults: [],
            parentMatchID: data.id as MainMatchID,
            // NOTE: 無限再帰になるのでネストは1つまでにする
            childMatches: undefined,
          }),
          match2: MainMatch.new({
            id: childrenMatch2.id as MainMatchID,
            courseIndex: childrenMatch2.courseIndex,
            matchIndex: childrenMatch2.matchIndex,
            departmentType: childrenMatch2.departmentType as DepartmentType,
            teamId1: (childrenMatch2.leftTeamId as TeamID) ?? undefined,
            teamId2: (childrenMatch2.rightTeamId as TeamID) ?? undefined,
            winnerId: (childrenMatch2.winnerTeamId as TeamID) ?? undefined,
            runResults: [],
            parentMatchID: data.id as MainMatchID,
            // NOTE: 無限再帰クエリになるのでネストは1つまでにする
            childMatches: undefined,
          }),
        };
      };
      const parentMatchID = (): MainMatchID | undefined => {
        // NOTE: 決勝戦はparentを持たない
        if (!data.parent1 && !data.parent2) {
          return undefined;
        }

        if (!data.parent1) return data.parent2!.id as MainMatchID;
        return data.parent1!.id as MainMatchID;
      };

      return MainMatch.new({
        id: data.id as MainMatchID,
        courseIndex: data.courseIndex,
        matchIndex: data.matchIndex,
        departmentType: data.departmentType as DepartmentType,
        teamId1: (data.leftTeamId as TeamID) ?? undefined,
        teamId2: (data.rightTeamId as TeamID) ?? undefined,
        winnerId: (data.winnerTeamId as TeamID) ?? undefined,
        runResults: data.runResult.map((v) =>
          RunResult.new({
            id: v.id as RunResultID,
            teamID: v.teamID as TeamID,
            points: v.points,
            // NOTE: Infinity: 2147483647
            goalTimeSeconds: v.goalTimeSeconds === this.INT32MAX ? Infinity : v.goalTimeSeconds,
            // NOTE: GOAL: 0 , FINISHED: 1
            finishState: v.finishState === 0 ? "GOAL" : "FINISHED",
          }),
        ),
        parentMatchID: parentMatchID(),
        childMatches: childrenMatches(),
      });
    });
  }

  async create(match: MainMatch): Promise<Result.Result<Error, void>> {
    try {
      await this.client.mainMatch.create({
        data: {
          id: match.getId(),
          courseIndex: match.getCourseIndex(),
          matchIndex: match.getMatchIndex(),
          departmentType: match.getDepartmentType(),
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
            departmentType: v.getDepartmentType(),
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
      const res = await this.client.mainMatch.findMany({
        include: {
          runResult: true, childrenRight: true, childrenLeft: true, parent1: true,
          parent2: true,
        },
      });
      return Result.ok(await this.deserialize(res));
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
          childrenLeft: true,
          childrenRight: true,
          parent1: true,
          parent2: true,
        },
      });
      if (!res) {
        return Option.none();
      }

      return Option.some((await this.deserialize([res]))[0]);
    } catch {
      return Option.none();
    }
  }

  async update(match: MainMatch): Promise<Result.Result<Error, void>> {
    try {
      const currentRunResults = await this.client.runResult.findMany({
        where: { mainMatchId: match.getId() },
      });
      const currentRunResultIDs = new Set<string>(currentRunResults.map((v) => v.id));

      // 複数更新と複数作成が同時にできないため、クエリを分ける
      const { updatable: updatableRunResults, new: newRunResults } = match
        .getRunResults()
        .reduce<{ updatable: RunResult[]; new: RunResult[] }>(
          (results, runResult) => {
            const updateType = currentRunResultIDs.has(runResult.getId()) ? "updatable" : "new";
            results[updateType].push(runResult);
            return results;
          },
          { updatable: [], new: [] },
        );

      await this.client.runResult.createMany({
        data: newRunResults.map((v) => ({
          id: v.getId(),
          teamID: v.getTeamId(),
          points: v.getPoints(),
          // NOTE: Infinity: 2147483647
          goalTimeSeconds: isFinite(v.getGoalTimeSeconds())
            ? v.getGoalTimeSeconds()
            : this.INT32MAX,
          mainMatchId: match.getId(),
          // NOTE: GOAL: 0 , FINISHED: 1
          finishState: v.isGoal() ? 0 : 1,
        })),
      });
      await this.client.mainMatch.update({
        where: {
          id: match.getId(),
        },
        data: {
          courseIndex: match.getCourseIndex(),
          matchIndex: match.getMatchIndex(),
          departmentType: match.getDepartmentType(),
          leftTeamId: match.getTeamId1(),
          rightTeamId: match.getTeamId2(),
          winnerTeamId: match.getWinnerId(),
          runResult: {
            updateMany: updatableRunResults.map((v) => ({
              where: {
                id: v.getId(),
              },
              data: {
                id: v.getId(),
                teamID: v.getTeamId(),
                points: v.getPoints(),
                // NOTE: Infinity: 2147483647
                goalTimeSeconds: isFinite(v.getGoalTimeSeconds())
                  ? v.getGoalTimeSeconds()
                  : this.INT32MAX,
                // NOTE: GOAL: 0 , FINISHED: 1
                finishState: v.isGoal() ? 0 : 1,
              },
            })),
          },
        },
      });

      return Result.ok(undefined);
    } catch (e) {
      return Result.err(e as Error);
    }
  }
}
