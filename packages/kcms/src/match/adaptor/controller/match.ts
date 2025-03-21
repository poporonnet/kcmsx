import { z } from '@hono/zod-openapi';
import { Result } from '@mikuroxina/mini-fn';
import { DepartmentType, MatchType } from 'config';
import { Team, TeamID } from '../../../team/models/team';
import { FetchTeamService } from '../../../team/service/fetchTeam';
import { MainMatch, MainMatchID } from '../../model/main';
import { PreMatch, PreMatchID } from '../../model/pre';
import { FetchRunResultService } from '../../service/fetchRunResult';
import { FetchTournamentService, Tournament } from '../../service/fetchTournament';
import { GenerateMainMatchService } from '../../service/generateMain';
import { GeneratePreMatchService } from '../../service/generatePre';
import { GenerateRankingService } from '../../service/generateRanking';
import { GetMatchService } from '../../service/get';
import { SetMainMatchWinnerService } from '../../service/setMainWinner';
import {
  GetMatchIDResponseSchema,
  GetMatchResponseSchema,
  GetMatchRunResultResponseSchema,
  GetMatchTypeResponseSchema,
  GetRankingResponseSchema,
  GetTournamentResponseSchema,
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
    private readonly generateMainMatchService: GenerateMainMatchService,
    private readonly fetchTournamentService: FetchTournamentService,
    private readonly setMainMatchWinnerService: SetMainMatchWinnerService
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

  async setWinner(matchID: string, winnerID: string): Promise<Result.Result<Error, void>> {
    const res = await this.setMainMatchWinnerService.handle(
      matchID as MainMatchID,
      winnerID as TeamID
    );
    if (Result.isErr(res)) return res;

    return Result.ok(undefined);
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
      const teamIDs = new Set(matches.flatMap((v) => [v.getTeamID1(), v.getTeamID2()]));
      const teamsMap = new Map<TeamID, Team>();
      for (const teamID of teamIDs) {
        if (!teamID) continue;

        const teamRes = await this.fetchTeamService.findByID(teamID);
        if (Result.isErr(teamRes)) return teamRes;
        const team = Result.unwrap(teamRes);
        teamsMap.set(team.getID(), team);
      }
      return Result.ok(
        matches.map((v): z.infer<typeof PreSchema> => {
          const team1Id = v.getTeamID1();
          const team2Id = v.getTeamID2();
          const team1 = team1Id && teamsMap.get(team1Id);
          const team2 = team2Id && teamsMap.get(team2Id);

          return {
            id: v.getID(),
            matchCode: `${v.getCourseIndex()}-${v.getMatchIndex()}`,
            matchType: 'pre',
            departmentType: v.getDepartmentType(),
            leftTeam: team1 && {
              id: team1.getID(),
              teamName: team1.getTeamName(),
            },
            rightTeam: team2 && {
              id: team2.getID(),
              teamName: team2.getTeamName(),
            },
            runResults:
              v.getRunResults()?.map(
                (v): z.infer<typeof RunResultSchema> => ({
                  id: v.getID(),
                  teamID: v.getTeamID(),
                  points: v.getPoints(),
                  goalTimeSeconds: v.getGoalTimeSeconds(),
                  finishState: v.isGoal() ? 'goal' : 'finished',
                })
              ) ?? [],
          };
        })
      );
    } else {
      const matchRes = await this.getMatchService.findAllMainMatch();
      if (Result.isErr(matchRes)) return matchRes;

      const matches = Result.unwrap(matchRes);
      const teamIDs = new Set(matches.flatMap((v) => [v.getTeamID1(), v.getTeamID2()]));
      const teamsMap = new Map<TeamID, Team>();
      for (const teamID of teamIDs) {
        if (!teamID) continue;

        const teamRes = await this.fetchTeamService.findByID(teamID);
        if (Result.isErr(teamRes)) return teamRes;
        const team = Result.unwrap(teamRes);
        teamsMap.set(team.getID(), team);
      }
      return Result.ok(
        matches.map((v): z.infer<typeof MainSchema> => {
          const team1Id = v.getTeamID1();
          const team2Id = v.getTeamID2();
          const team1 = team1Id && teamsMap.get(team1Id);
          const team2 = team2Id && teamsMap.get(team2Id);

          return {
            id: v.getID(),
            matchCode: `${v.getCourseIndex()}-${v.getMatchIndex()}`,
            matchType: 'main',
            departmentType: v.getDepartmentType(),
            team1: team1 && {
              id: team1.getID(),
              teamName: team1.getTeamName(),
            },
            team2: team2 && {
              id: team2.getID(),
              teamName: team2.getTeamName(),
            },
            winnerID: v.getWinnerID() ?? '',
            runResults:
              v.getRunResults()?.map(
                (v): z.infer<typeof RunResultSchema> => ({
                  id: v.getID(),
                  teamID: v.getTeamID(),
                  points: v.getPoints(),
                  goalTimeSeconds: v.getGoalTimeSeconds(),
                  finishState: v.isGoal() ? 'goal' : 'finished',
                })
              ) ?? [],
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

  async getTournament(
    departmentType: DepartmentType
  ): Promise<Result.Result<Error, z.infer<typeof GetTournamentResponseSchema>>> {
    const teamsRes = await this.fetchTeamService.findAll();
    if (Result.isErr(teamsRes)) return teamsRes;

    const teamMap = new Map(Result.unwrap(teamsRes).map((v) => [v.getID(), v]));
    const tournamentRes = await this.fetchTournamentService.handle(departmentType);
    if (Result.isErr(tournamentRes)) return tournamentRes;

    const tournament = Result.unwrap(tournamentRes);

    const buildTournament = (
      tournament: Tournament
    ): z.infer<typeof GetTournamentResponseSchema> => {
      const match = tournament.match;
      const teamID1 = match.getTeamID1();
      const teamID2 = match.getTeamID2();

      return {
        id: match.getID(),
        matchCode: `${match.getCourseIndex()}-${match.getMatchIndex()}`,
        matchType: 'main',
        departmentType: match.getDepartmentType(),
        team1: teamID1 && {
          id: teamID1,
          teamName: teamMap.get(teamID1)!.getTeamName(),
        },
        team2: teamID2 && {
          id: teamID2,
          teamName: teamMap.get(teamID2)!.getTeamName(),
        },
        winnerID: match.getWinnerID() ?? '',
        childMatch1: tournament.childMatch1 && buildTournament(tournament.childMatch1),
        childMatch2: tournament.childMatch2 && buildTournament(tournament.childMatch2),
      };
    };

    return Result.ok(buildTournament(tournament));
  }
}
