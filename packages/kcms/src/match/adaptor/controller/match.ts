import { GetMatchService } from '../../service/get';
import { z } from '@hono/zod-openapi';
import {
  GetMatchResponseSchema,
  GetMatchTypeResponseSchema,
  MainSchema,
  PreSchema,
  RunResultSchema,
} from '../validator/match';
import { Result } from '@mikuroxina/mini-fn';
import { MatchType } from 'config';
import { FetchTeamService } from '../../../team/service/get';
import { Team, TeamID } from '../../../team/models/team';

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
  async getMatchesByType(
    type: MatchType
  ): Promise<Result.Result<Error, z.infer<typeof GetMatchTypeResponseSchema>>> {
    if (type === 'pre') {
      const matcheRes = await this.getMatchService.findAllPreMatch();
      if (Result.isErr(matcheRes)) return Result.err(new Error('Failed to get matches'));
      const matches = Result.unwrap(matcheRes);
      const teamIDs = new Set(matches.map((v) => [v.getTeamId1(), v.getTeamId2()]).flat());
      const teamsMap = new Map<TeamID, Team>();

      for (const teamID of teamIDs) {
        const teamRes = await this.fetchTeamService.findByID(teamID as TeamID);
        if (Result.isErr(teamRes)) return Result.err(new Error('Failed to get teams'));
        const team = Result.unwrap(teamRes);
        teamsMap.set(team.getId(), team);
      }
      return Result.ok(
        matches.map((v): z.infer<typeof PreSchema> => {
          const leftTeamName = teamsMap.get(v.getTeamId1() ?? ('' as TeamID))!.getTeamName();
          const rightTeamName = teamsMap.get(v.getTeamId2() ?? ('' as TeamID))!.getTeamName();
          return {
            id: v.getId(),
            matchCode: `${v.getCourseIndex()}-${v.getMatchIndex()}`,
            departmentType: v.getDepartmentType(),
            leftTeam:
              v.getTeamId1() == undefined
                ? undefined
                : {
                    id: v.getTeamId1()!,
                    teamName: leftTeamName,
                  },

            rightTeam:
              v.getTeamId2() == undefined
                ? undefined
                : {
                    id: v.getTeamId2()!,
                    teamName: rightTeamName,
                  },
            runResults:
              v.getRunResults() == undefined
                ? []
                : v.getRunResults().map(
                    (v): z.infer<typeof RunResultSchema> => ({
                      id: v.getId(),
                      teamID: v.getTeamId(),
                      points: v.getPoints(),
                      goalTimeSeconds: v.getGoalTimeSeconds(),
                      finishState: v.isGoal() ? 'goal' : 'finished',
                    })
                  ),
          };
        })
      );
    } else {
      const matcheRes = await this.getMatchService.findAllMainMatch();
      if (Result.isErr(matcheRes)) return Result.err(new Error('Failed to get matches'));
      const matches = Result.unwrap(matcheRes);
      const teamIDs = new Set(matches.map((v) => [v.getTeamId1(), v.getTeamId2()]).flat());
      const teamsMap = new Map<TeamID, Team>();
      for (const teamID of teamIDs) {
        const teamRes = await this.fetchTeamService.findByID(teamID as TeamID);
        if (Result.isErr(teamRes)) return Result.err(new Error('Failed to get teams'));
        const team = Result.unwrap(teamRes);
        teamsMap.set(team.getId(), team);
      }
      return Result.ok(
        matches.map((v): z.infer<typeof MainSchema> => {
          const team1Name = teamsMap.get(v.getTeamId1() ?? ('' as TeamID))!.getTeamName();
          const team2Name = teamsMap.get(v.getTeamId2() ?? ('' as TeamID))!.getTeamName();
          return {
            id: v.getId(),
            matchCode: `${v.getCourseIndex()}-${v.getMatchIndex()}`,
            departmentType: teamsMap.get(v.getTeamId1() ?? ('' as TeamID))!.getDepartmentType(),
            team1:
              v.getTeamId1() == undefined
                ? undefined
                : {
                    id: v.getTeamId1()!,
                    teamName: team1Name,
                  },

            team2:
              v.getTeamId2() == undefined
                ? undefined
                : {
                    id: v.getTeamId2()!,
                    teamName: team2Name,
                  },
            winnerID: v.getWinnerId() ?? '',
            runResults:
              v.getRunResults() == undefined
                ? []
                : v.getRunResults().map(
                    (v): z.infer<typeof RunResultSchema> => ({
                      id: v.getId(),
                      teamID: v.getTeamId(),
                      points: v.getPoints(),
                      goalTimeSeconds: v.getGoalTimeSeconds(),
                      finishState: v.isGoal() ? 'goal' : 'finished',
                    })
                  ),
          };
        })
      );
    }
    return Result.err(new Error('Non existent match type'));
  }
}
