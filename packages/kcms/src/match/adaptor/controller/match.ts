import { GetMatchService } from '../../service/get';
import { z } from '@hono/zod-openapi';
import { GetMatchResponseSchema, GetMatchTypeResponseSchema, PreSchema } from '../validator/match';
import { Result } from '@mikuroxina/mini-fn';
import { DepartmentType, MatchType } from 'config';
import { FetchTeamService } from '../../../team/service/get';
import { TeamID } from '../../../team/models/team';

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
        const getTeamDepartmentType = (
          left: TeamID | undefined,
          right: TeamID | undefined
        ): DepartmentType => {
          if (!left && !right) throw new Error('Both teamID is undefined');
          return teamMap.get(left || right!)!.getDepartmentType();
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
            finishState: v.isGoal() ? 'goal' : 'finished',
          })),
        };
      }),
      // ToDo: 本戦試合を取得できるようにする
      main: [],
    });
  }
  async getMatchesByType(
    type: MatchType
  ): Promise<Result.Result<Error, z.infer<typeof GetMatchTypeResponseSchema>>> {
    if (type === 'pre') {
      const matches = await this.getMatchService.findAllPreMatch();
      if (Result.isErr(matches)) return matches;
      const unwrapped = Result.unwrap(matches);

      return Result.ok(
        unwrapped.map((v): z.infer<typeof PreSchema> => {
          return {
            id: v.getId(),
            matchCode: `${v.getCourseIndex()}-${v.getMatchIndex()}`,
            departmentType: v.getDepartmentType(),
            leftTeam: {
              id: v.getTeamId1() as TeamID,
              teamName: '',
            },
            rightTeam: {
              id: v.getTeamId2() as TeamID,
              teamName: '',
            },
            runResults: v.getRunResults().map((v) => ({
              id: v.getId(),
              teamID: v.getTeamId(),
              points: v.getPoints(),
              goalTimeSeconds: v.getGoalTimeSeconds(),
              finishState: v.isGoal() ? 'goal' : 'finished',
            })),
          };
        })
      );
    } else {
      const matches = await this.getMatchService.findAllMainMatch();
      if (Result.isErr(matches)) return matches;
      const unwrapped = Result.unwrap(matches);
    }
    return Result.err(new Error('Non existent match type'));
  }
}
