import { GetMatchService } from '../../service/get';
import { z } from '@hono/zod-openapi';
import {
  GetMatchIdResponseSchema,
  GetMatchResponseSchema,
  PostMatchGenerateResponseSchema,
  PreSchema,
  RunResultSchema,
} from '../validator/match';
import { Result } from '@mikuroxina/mini-fn';
import { FetchTeamService } from '../../../team/service/get';
import { TeamID } from '../../../team/models/team';
import { GeneratePreMatchService } from '../../service/generatePre';
import { DepartmentType, MatchType } from 'config';
import { MainMatchID } from '../../model/main';
import { PreMatch, PreMatchID } from '../../model/pre';

export class MatchController {
  constructor(
    private readonly getMatchService: GetMatchService,
    private readonly fetchTeamService: FetchTeamService,
    private readonly generatePreMatchService: GeneratePreMatchService
  ) {}

  async getAll(): Promise<Result.Result<Error, z.infer<typeof GetMatchResponseSchema>>> {
    const matchesRes = await this.getMatchService.findAll();
    if (Result.isErr(matchesRes)) return matchesRes;
    const match = Result.unwrap(matchesRes);

    const teamsRes = await this.fetchTeamService.findAll();
    if (Result.isErr(teamsRes)) return teamsRes;
    const teams = Result.unwrap(teamsRes);

    const teamMap = new Map(teams.map((v) => [v.getId(), v]));

    /**
     * ToDo: 試合の部門を取得できるようにする
     *       試合に参加するチーム情報を取得する
     */
    return Result.ok({
      pre: match.pre.map((v): z.infer<typeof PreSchema> => {
        const getTeam = (
          teamID: TeamID | undefined
        ): { id: string; teamName: string } | undefined => {
          if (!teamID) return undefined;
          const team = teamMap.get(teamID);
          if (!team) return undefined;
          return {
            id: team.getId(),
            teamName: team.getTeamName(),
          };
        };

        return {
          id: v.getId(),
          matchCode: `${v.getCourseIndex()}-${v.getMatchIndex()}`,
          departmentType: v.getDepartmentType(),
          leftTeam: getTeam(v.getTeamId1()),
          rightTeam: getTeam(v.getTeamId2()),
          runResults: v.getRunResults().map((v) => ({
            id: v.getId(),
            teamID: v.getTeamId(),
            points: v.getPoints(),
            goalTimeSeconds: v.getGoalTimeSeconds(),
            finishState: v.isGoal() ? 'goal' : 'finished',
          })),
        };
      }),
      // ToDo: 本戦試合を取得できるようにする
      main: [],
    });
  }

  async generateMatch(
    matchType: MatchType,
    departmentType: DepartmentType
  ): Promise<Result.Result<Error, z.infer<typeof PostMatchGenerateResponseSchema>>> {
    // ToDo: 本戦試合を生成できるようにする
    if (matchType === 'main') {
      return Result.err(new Error('Not implemented'));
    }

    const res = await this.generatePreMatchService.handle(departmentType);
    if (Result.isErr(res)) return res;
    const matches = Result.unwrap(res);

    return Result.ok(
      matches.map((v) => {
        return {
          id: v.getId(),
          matchCode: `${v.getCourseIndex()}-${v.getMatchIndex()}`,
          departmentType: v.getDepartmentType(),
          leftTeamID: v.getTeamId1(),
          rightTeamID: v.getTeamId2(),
          runResults: [],
        };
      })
    );
  }

  async getMatchByID<T extends MatchType>(
    matchType: T,
    id: T extends 'pre' ? PreMatchID : MainMatchID
  ): Promise<Result.Result<Error, z.infer<typeof GetMatchIdResponseSchema>>> {
    if (matchType === 'pre') {
      const res = await this.getMatchService.findById(id);
      if (Result.isErr(res)) return res;
      const match = Result.unwrap(res) as PreMatch;

      const getTeam = async (
        teamID: TeamID | undefined
      ): Promise<{ id: string; teamName: string } | undefined> => {
        if (!teamID) return undefined;
        const teamRes = await this.fetchTeamService.findByID(teamID);
        if (Result.isErr(teamRes)) return undefined;
        const team = Result.unwrap(teamRes);
        return {
          id: team.getId(),
          teamName: team.getTeamName(),
        };
      };

      return Result.ok({
        id: match.getId(),
        matchCode: `${match.getCourseIndex()}-${match.getMatchIndex()}`,
        departmentType: match.getDepartmentType(),
        leftTeam: await getTeam(match.getTeamId1()),
        rightTeam: await getTeam(match.getTeamId2()),
        runResults: match.getRunResults().map(
          (v): z.infer<typeof RunResultSchema> => ({
            id: v.getId(),
            teamID: v.getTeamId(),
            points: v.getPoints(),
            goalTimeSeconds: v.getGoalTimeSeconds(),
            finishState: v.isGoal() ? 'goal' : 'finished',
          })
        ),
      });
    } else {
      return Result.err(new Error('Not implemented'));
    }
  }
}
