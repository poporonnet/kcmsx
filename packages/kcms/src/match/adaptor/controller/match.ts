import { z } from '@hono/zod-openapi';
import { Result } from '@mikuroxina/mini-fn';
import { DepartmentType, MatchType } from 'config';
import { Team, TeamID } from '../../../team/models/team';
import { FetchTeamService } from '../../../team/service/fetchTeam';
import { MainMatch, MainMatchID } from '../../model/main';
import { PreMatch, PreMatchID } from '../../model/pre';
import { FetchRunResultService } from '../../service/fetchRunResult';
import { GenerateMainMatchService } from '../../service/generateMain';
import { GeneratePreMatchService } from '../../service/generatePre';
import { GenerateRankingService } from '../../service/generateRanking';
import { GetMatchService } from '../../service/get';
import {
  GetMatchIDResponseSchema,
  GetMatchResponseSchema,
  GetMatchRunResultResponseSchema,
  GetMatchTypeResponseSchema,
  GetRankingResponseSchema,
  MainSchema,
  PostMatchGenerateManualResponseSchema,
  PostMatchGenerateResponseSchema,
  PreSchema,
  RunResultSchema,
  ShortMainSchema,
  ShortPreSchema,
} from '../validator/match';

export class MatchController {
  constructor(
    private readonly getMatchService: GetMatchService,
    private readonly fetchTeamService: FetchTeamService,
    private readonly generatePreMatchService: GeneratePreMatchService,
    private readonly generateRankingService: GenerateRankingService,
    private readonly fetchRunResultService: FetchRunResultService,
    private readonly generateMainMatchService: GenerateMainMatchService
  ) {}

  async getAll(): Promise<Result.Result<Error, z.infer<typeof GetMatchResponseSchema>>> {
    const matchesRes = await this.getMatchService.findAll();
    if (Result.isErr(matchesRes)) return matchesRes;
    const match = Result.unwrap(matchesRes);

    const teamsRes = await this.fetchTeamService.findAll();
    if (Result.isErr(teamsRes)) return teamsRes;
    const teams = Result.unwrap(teamsRes);

    const teamMap = new Map(teams.map((v) => [v.getID(), v]));

    const getTeam = (teamID: TeamID | undefined): { id: string; teamName: string } | undefined => {
      if (!teamID) return undefined;
      const team = teamMap.get(teamID);
      if (!team) return undefined;
      return {
        id: team.getID(),
        teamName: team.getTeamName(),
      };
    };

    return Result.ok({
      pre: match.pre.map(
        (v): z.infer<typeof PreSchema> => ({
          id: v.getID(),
          matchCode: `${v.getCourseIndex()}-${v.getMatchIndex()}`,
          matchType: 'pre',
          departmentType: v.getDepartmentType(),
          leftTeam: getTeam(v.getTeamID1()),
          rightTeam: getTeam(v.getTeamID2()),
          runResults: v.getRunResults().map((v) => ({
            id: v.getID(),
            teamID: v.getTeamID(),
            points: v.getPoints(),
            goalTimeSeconds: v.getGoalTimeSeconds(),
            finishState: v.isGoal() ? 'goal' : 'finished',
          })),
        })
      ),
      main: match.main.map(
        (v): z.infer<typeof MainSchema> => ({
          id: v.getID(),
          matchCode: `${v.getCourseIndex()}-${v.getMatchIndex()}`,
          matchType: 'main',
          departmentType: v.getDepartmentType(),
          team1: getTeam(v.getTeamID1()),
          team2: getTeam(v.getTeamID2()),
          winnerID: v.getWinnerID() ?? '',
          runResults: v.getRunResults().map((v) => ({
            id: v.getID(),
            teamID: v.getTeamID(),
            points: v.getPoints(),
            goalTimeSeconds: v.getGoalTimeSeconds(),
            finishState: v.isGoal() ? 'goal' : 'finished',
          })),
        })
      ),
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
      matches.map((v): z.infer<typeof ShortPreSchema> => {
        return {
          id: v.getID(),
          matchCode: `${v.getCourseIndex()}-${v.getMatchIndex()}`,
          matchType: 'pre',
          departmentType: v.getDepartmentType(),
          leftTeamID: v.getTeamID1(),
          rightTeamID: v.getTeamID2(),
          runResults: [],
        };
      })
    );
  }

  async generateMatchManual(
    departmentType: DepartmentType,
    teamIDs: string[]
  ): Promise<Result.Result<Error, z.infer<typeof PostMatchGenerateManualResponseSchema>>> {
    const res = await this.generateMainMatchService.handle(departmentType, teamIDs as TeamID[]);
    if (Result.isErr(res)) return res;

    const match = Result.unwrap(res);
    return Result.ok<z.infer<typeof ShortMainSchema>[]>(
      match.map((v) => ({
        id: v.getID(),
        matchCode: `${v.getCourseIndex()}-${v.getMatchIndex()}`,
        matchType: 'main',
        departmentType: v.getDepartmentType(),
        team1ID: v.getTeamID1(),
        team2ID: v.getTeamID2(),
        runResults: [],
        winnerID: v.getWinnerID() ?? '',
      }))
    );
  }

  async getMatchByID<T extends MatchType>(
    matchType: T,
    id: T extends 'pre' ? PreMatchID : MainMatchID
  ): Promise<Result.Result<Error, z.infer<typeof GetMatchIDResponseSchema>>> {
    const res = await this.getMatchService.findByID(id);
    if (Result.isErr(res)) return res;
    const match = Result.unwrap(res);

    const getTeam = async (
      teamID: TeamID | undefined
    ): Promise<{ id: string; teamName: string } | undefined> => {
      if (!teamID) return undefined;
      const teamRes = await this.fetchTeamService.findByID(teamID);
      if (Result.isErr(teamRes)) return undefined;
      const team = Result.unwrap(teamRes);
      return {
        id: team.getID(),
        teamName: team.getTeamName(),
      };
    };

    if (matchType === 'pre') {
      const pre = match as PreMatch;

      return Result.ok<z.infer<typeof PreSchema>>({
        id: pre.getID(),
        matchCode: `${pre.getCourseIndex()}-${pre.getMatchIndex()}`,
        matchType: 'pre',
        departmentType: pre.getDepartmentType(),
        leftTeam: await getTeam(pre.getTeamID1()),
        rightTeam: await getTeam(pre.getTeamID2()),
        runResults: pre.getRunResults().map(
          (v): z.infer<typeof RunResultSchema> => ({
            id: v.getID(),
            teamID: v.getTeamID(),
            points: v.getPoints(),
            goalTimeSeconds: v.getGoalTimeSeconds(),
            finishState: v.isGoal() ? 'goal' : 'finished',
          })
        ),
      });
    } else {
      const main = match as MainMatch;

      return Result.ok<z.infer<typeof MainSchema>>({
        id: main.getID(),
        matchCode: `${main.getCourseIndex()}-${main.getMatchIndex()}`,
        matchType: 'main',
        departmentType: main.getDepartmentType(),
        team1: await getTeam(main.getTeamID1()),
        team2: await getTeam(main.getTeamID2()),
        winnerID: main.getWinnerID() ?? '',
        runResults: main.getRunResults().map(
          (v): z.infer<typeof RunResultSchema> => ({
            id: v.getID(),
            teamID: v.getTeamID(),
            points: v.getPoints(),
            goalTimeSeconds: v.getGoalTimeSeconds(),
            finishState: v.isGoal() ? 'goal' : 'finished',
          })
        ),
      });
    }
  }

  async getMatchByType(
    matchType: MatchType
  ): Promise<Result.Result<Error, z.infer<typeof GetMatchTypeResponseSchema>>> {
    if (matchType === 'pre') {
      const matchRes = await this.getMatchService.findAllPreMatch();
      if (Result.isErr(matchRes)) return matchRes;
      const matches = Result.unwrap(matchRes);
      const teamIDs = new Set(matches.map((v) => [v.getTeamID1(), v.getTeamID2()]).flat());
      const teamsMap = new Map<TeamID, Team>();
      for (const teamID of teamIDs) {
        const teamRes = await this.fetchTeamService.findByID(teamID as TeamID);
        if (Result.isErr(teamRes)) return teamRes;
        const team = Result.unwrap(teamRes);
        teamsMap.set(team.getID(), team);
      }
      return Result.ok(
        matches.map((v): z.infer<typeof PreSchema> => {
          const team1Name = teamsMap.get(v.getTeamID1() ?? ('' as TeamID))!.getTeamName();
          const team2Name = teamsMap.get(v.getTeamID2() ?? ('' as TeamID))!.getTeamName();
          return {
            id: v.getID(),
            matchCode: `${v.getCourseIndex()}-${v.getMatchIndex()}`,
            matchType: 'pre',
            departmentType: teamsMap.get(v.getTeamID1() ?? ('' as TeamID))!.getDepartmentType(),
            leftTeam:
              v.getTeamID1() == undefined
                ? undefined
                : {
                    id: v.getTeamID1()!,
                    teamName: team1Name,
                  },
            rightTeam:
              v.getTeamID2() == undefined
                ? undefined
                : {
                    id: v.getTeamID2()!,
                    teamName: team2Name,
                  },
            runResults:
              v.getRunResults() == undefined
                ? []
                : v.getRunResults().map(
                    (v): z.infer<typeof RunResultSchema> => ({
                      id: v.getID(),
                      teamID: v.getTeamID(),
                      points: v.getPoints(),
                      goalTimeSeconds: v.getGoalTimeSeconds(),
                      finishState: v.isGoal() ? 'goal' : 'finished',
                    })
                  ),
          };
        })
      );
    } else {
      const matchRes = await this.getMatchService.findAllMainMatch();
      if (Result.isErr(matchRes)) return matchRes;
      const matches = Result.unwrap(matchRes);
      const teamIDs = new Set(matches.map((v) => [v.getTeamID1(), v.getTeamID2()]).flat());
      const teamsMap = new Map<TeamID, Team>();
      for (const teamID of teamIDs) {
        const teamRes = await this.fetchTeamService.findByID(teamID as TeamID);
        if (Result.isErr(teamRes)) return teamRes;
        const team = Result.unwrap(teamRes);
        teamsMap.set(team.getID(), team);
      }
      return Result.ok(
        matches.map((v): z.infer<typeof MainSchema> => {
          const team1Name = teamsMap.get(v.getTeamID1() ?? ('' as TeamID))!.getTeamName();
          const team2Name = teamsMap.get(v.getTeamID2() ?? ('' as TeamID))!.getTeamName();
          return {
            id: v.getID(),
            matchCode: `${v.getCourseIndex()}-${v.getMatchIndex()}`,
            matchType: 'main',
            departmentType: teamsMap.get(v.getTeamID1() ?? ('' as TeamID))!.getDepartmentType(),
            team1:
              v.getTeamID1() == undefined
                ? undefined
                : {
                    id: v.getTeamID1()!,
                    teamName: team1Name,
                  },
            team2:
              v.getTeamID2() == undefined
                ? undefined
                : {
                    id: v.getTeamID2()!,
                    teamName: team2Name,
                  },
            winnerID: v.getWinnerID() ?? '',
            runResults:
              v.getRunResults() == undefined
                ? []
                : v.getRunResults().map(
                    (v): z.infer<typeof RunResultSchema> => ({
                      id: v.getID(),
                      teamID: v.getTeamID(),
                      points: v.getPoints(),
                      goalTimeSeconds: v.getGoalTimeSeconds(),
                      finishState: v.isGoal() ? 'goal' : 'finished',
                    })
                  ),
          };
        })
      );
    }
  }

  async getRanking(
    matchType: MatchType,
    departmentType: DepartmentType
  ): Promise<Result.Result<Error, z.infer<typeof GetRankingResponseSchema>>> {
    const generateRanking = {
      pre: () => this.generateRankingService.generatePreMatchRanking(departmentType),
      main: () => this.generateRankingService.generateMainMatchRanking(departmentType),
    }[matchType];
    const rankingRes = await generateRanking();
    if (Result.isErr(rankingRes)) return rankingRes;
    const ranking = Result.unwrap(rankingRes);

    // NOTE: 一つずつ取得しても良いが、エラーの扱いが煩雑になるので簡単化のために*一時的に*全て取得するようにした
    const teamsRes = await this.fetchTeamService.findAll();
    if (Result.isErr(teamsRes)) return teamsRes;
    const teamsMap = new Map<TeamID, Team>(Result.unwrap(teamsRes).map((v) => [v.getID(), v]));

    return Result.ok(
      ranking.map((v) => ({
        rank: v.rank,
        teamID: v.teamID,
        teamName: teamsMap.get(v.teamID)!.getTeamName(),
        points: v.points,
        goalTimeSeconds: v.goalTimeSeconds,
      }))
    );
  }

  async getRunResultsByMatchID(
    matchType: MatchType,
    matchID: PreMatchID | MainMatchID
  ): Promise<Result.Result<Error, z.infer<typeof GetMatchRunResultResponseSchema>>> {
    const res = await this.fetchRunResultService.handle(matchType, matchID as PreMatchID);
    if (Result.isErr(res)) return res;
    return Result.ok(
      Result.unwrap(res).map(
        (v): z.infer<typeof RunResultSchema> => ({
          id: v.getID(),
          teamID: v.getTeamID(),
          points: v.getPoints(),
          goalTimeSeconds: v.getGoalTimeSeconds(),
          finishState: v.isGoal() ? 'goal' : 'finished',
        })
      )
    );
  }
}
