import { GetMatchService } from '../../service/get';
import { z } from '@hono/zod-openapi';
import { GetMatchResponseSchema } from '../validator/match';
import { Result } from '@mikuroxina/mini-fn';
import { DepartmentType } from 'config';
import { FetchTeamService } from '../../../team/service/get';
import { TeamID } from '../../../team/models/team';

export class MatchController {
  constructor(
    private readonly getMatchService: GetMatchService,
    private readonly fetchTeamService: FetchTeamService
  ) {}

  async getAllMatch(): Promise<Result.Result<Error, z.infer<typeof GetMatchResponseSchema>>> {
    const res = await this.getMatchService.findAll();
    if (Result.isErr(res)) return res;
    const match = Result.unwrap(res);

    const teamsRes = await this.fetchTeamService.findAll();
    if (Result.isErr(teamsRes)) return teamsRes;
    const teams = Result.unwrap(teamsRes);

    const teamMap = new Map(teams.map((v) => [v.getId(), v]));

    /**
     * ToDo: 試合の部門を取得できるようにする
     *       試合に参加するチーム情報を取得する
     */
    return Result.ok({
      pre: match.pre.map((v) => {
        const getTeam = (
          teamID: TeamID | undefined
        ): { id: string; teamName: string } | undefined => {
          if (!teamID) return undefined;
          const getTeam = teamMap.get(teamID);
          if (!getTeam) return undefined;
          return {
            id: getTeam.getId(),
            teamName: getTeam.getTeamName(),
          };
        };
        const getTeamDepartmentType = (
          left: TeamID | undefined,
          right: TeamID | undefined
        ): DepartmentType => {
          if (!left && !right) throw new Error('Both teamID is undefined');
          if (!left) {
            return teamMap.get(right!)!.getDepartmentType();
          }
          return teamMap.get(left)!.getDepartmentType();
        };

        return {
          id: v.getId(),
          matchCode: `${v.getCourseIndex()}-${v.getMatchIndex()}`,
          departmentType: getTeamDepartmentType(v.getTeamId1(), v.getTeamId2()),
          leftTeam: getTeam(v.getTeamId1()),
          rightTeam: getTeam(v.getTeamId2()),
          runResults: v.getRunResults().map((v) => ({
            id: v.getId(),
            teamID: v.getTeamId(),
            points: v.getPoints(),
            goalTimeSeconds: v.getGoalTimeSeconds(),
            finishState: v.isGoal() ? ('goal' as const) : ('finished' as const),
          })),
        };
      }),
      // ToDo: 本戦試合を取得できるようにする
      main: [],
    });
  }
}
