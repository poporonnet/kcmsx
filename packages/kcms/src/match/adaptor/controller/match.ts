import { GetMatchService } from '../../service/get';
import { z } from '@hono/zod-openapi';
import {
  GetMatchIdResponseSchema,
  GetMatchResponseSchema,
  PreSchema,
  RunResultSchema,
} from '../validator/match';
import { Result } from '@mikuroxina/mini-fn';
import { FetchTeamService } from '../../../team/service/get';
import { TeamID } from '../../../team/models/team';
import { MainMatchID } from '../../model/main';
import { MatchType } from 'config';
import { PreMatch, PreMatchID } from '../../model/pre';

export class MatchController {
  constructor(
    private readonly getMatchService: GetMatchService,
    private readonly fetchTeamService: FetchTeamService
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
