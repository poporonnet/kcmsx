import { Result } from '@mikuroxina/mini-fn';
import { DepartmentType } from 'config';
import { TeamID } from '../../team/models/team';
import { MainMatch } from '../model/main';
import { PreMatch } from '../model/pre';
import { MainMatchRepository, PreMatchRepository } from '../model/repository';
import { RunResult } from '../model/runResult';

export interface RankingDatum {
  rank: number;
  teamID: TeamID;
  points: number;
  goalTimeSeconds: number;
}

export class GenerateRankingService {
  constructor(
    private readonly preMatchRepository: PreMatchRepository,
    private readonly mainMatchRepository: MainMatchRepository
  ) {}

  async generatePreMatchRanking(
    departmentType: DepartmentType
  ): Promise<Result.Result<Error, RankingDatum[]>> {
    const matchesRes = await this.preMatchRepository.findAll();
    if (Result.isErr(matchesRes)) {
      return matchesRes;
    }
    const departmentMatches = Result.unwrap(matchesRes).filter(
      (match) => match.getDepartmentType() === departmentType
    );

    return this.generateRanking(departmentMatches);
  }

  async generateMainMatchRanking(
    departmentType: DepartmentType
  ): Promise<Result.Result<Error, RankingDatum[]>> {
    const matchesRes = await this.mainMatchRepository.findAll();
    if (Result.isErr(matchesRes)) {
      return matchesRes;
    }
    const departmentMatches = Result.unwrap(matchesRes).filter(
      (match) => match.getDepartmentType() === departmentType
    );

    return this.generateRanking(departmentMatches);
  }

  private async generateRanking(
    matches: (PreMatch | MainMatch)[]
  ): Promise<Result.Result<Error, RankingDatum[]>> {
    // 各チームごとに走行結果を集める
    const teamRunResults = new Map<TeamID, RunResult[]>();
    const addRunResults = (teamID: TeamID | undefined, runResultSource: RunResult[]) => {
      if (!teamID) return;

      const runResults = runResultSource.filter((result) => result.getTeamId() === teamID);
      const prev = teamRunResults.get(teamID) ?? [];
      teamRunResults.set(teamID, [...prev, ...runResults]);
    };
    matches.forEach((match) => {
      const runResults = match.getRunResults();
      addRunResults(match.getTeamId1(), runResults);
      addRunResults(match.getTeamId2(), runResults);
    });

    // 各チームごとに結果を集計する
    const teamResults = [...teamRunResults.entries()].map(
      ([teamID, runResults]): [TeamID, { points: number; goalTimeSeconds: number }] => [
        teamID,
        {
          points: runResults.reduce((sum, result) => sum + result.getPoints(), 0),
          goalTimeSeconds: Math.min(...runResults.map((result) => result.getGoalTimeSeconds())),
        },
      ]
    );

    // 点数でソート (ゴールタイム: 早い順(asc)、ポイント: 大きい順(desc))
    const sortedTeams = teamResults.sort((a, b) =>
      a[1].points === b[1].points
        ? a[1].goalTimeSeconds - b[1].goalTimeSeconds
        : b[1].points - a[1].points
    );

    const rankingData: RankingDatum[] = [];
    // NOTE: Mapをfor..ofで回すと[key,value]しか取れないので一回展開して[index,value]にしている
    for (const [i, v] of sortedTeams.entries()) {
      /** 前回の点数 */
      const prevPoints = rankingData[i - 1]?.points ?? -1;
      /** 前回のゴールタイム */
      const prevGoalTime = rankingData[i - 1]?.goalTimeSeconds ?? Infinity;
      const rank = rankingData[i - 1]?.rank ?? 0;
      const isSameRank = v[1].points === prevPoints && v[1].goalTimeSeconds === prevGoalTime;
      const currentRank = isSameRank ? rank : i + 1;
      rankingData.push({
        rank: currentRank,
        teamID: v[0],
        points: v[1].points,
        goalTimeSeconds: v[1].goalTimeSeconds,
      });
    }

    return Result.ok(rankingData);
  }
}
