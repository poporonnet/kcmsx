import { Result } from '@mikuroxina/mini-fn';
import { DepartmentType } from 'config';
import { TeamID } from '../../team/models/team';
import { PreMatchRepository } from '../model/repository';

export interface RankingDatum {
  rank: number;
  teamID: TeamID;
  points: number;
  goalTimeSeconds: number;
}

export class GenerateRankingService {
  constructor(private readonly preMatchRepository: PreMatchRepository) {}

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

    // 各チームごとに走行結果を集める
    const teamResults = new Map<TeamID, { points: number; goalTimeSeconds: number }>();
    for (const v of departmentMatches) {
      // チーム1の結果
      const team1 = v.getTeamId1();
      // 存在しないなら何もしない
      if (team1 !== undefined) {
        const team1Result = v.getRunResults().filter((v) => v.getTeamId() === team1);
        // 試合が始まっていないなら
        if (team1Result.length === 0) {
          teamResults.set(team1, {
            points: 0,
            goalTimeSeconds: 0,
          });
        } else if (teamResults.has(team1)) {
          const prev = teamResults.get(team1)!;
          // 1つの予選試合には1回ずつしか結果がないので、0個めを取る
          teamResults.set(team1, {
            points: prev.points + team1Result[0].getPoints(),
            // NOTE: 早い方を採用する
            goalTimeSeconds:
              prev.goalTimeSeconds < team1Result[0].getGoalTimeSeconds()
                ? prev.goalTimeSeconds
                : team1Result[0].getGoalTimeSeconds(),
          });
        } else {
          teamResults.set(team1, {
            points: team1Result[0].getPoints(),
            goalTimeSeconds: team1Result[0].getGoalTimeSeconds(),
          });
        }
      }

      // チーム2の結果
      const team2 = v.getTeamId2();
      // 存在しないなら何もしない
      if (team2 !== undefined) {
        const team2Result = v.getRunResults().filter((v) => v.getTeamId() === team2);
        if (team2Result.length === 0) {
          teamResults.set(team2, {
            points: 0,
            goalTimeSeconds: 0,
          });
        } else if (teamResults.has(team2)) {
          const prev = teamResults.get(team2)!;
          teamResults.set(team2, {
            // 1つの予選試合には1回ずつしか結果がないので、0個めを取る
            points: prev.points + team2Result[0].getPoints(),
            goalTimeSeconds:
              prev.goalTimeSeconds < team2Result[0].getGoalTimeSeconds()
                ? prev.goalTimeSeconds
                : team2Result[0].getGoalTimeSeconds(),
          });
        } else {
          teamResults.set(team2, {
            points: team2Result[0].getPoints(),
            goalTimeSeconds: team2Result[0].getGoalTimeSeconds(),
          });
        }
      }
    }
    // 点数でソート
    const sortedTeams = [...teamResults.entries()].sort((a, b) =>
      a[1].points - b[1].points === 0
        ? a[1].goalTimeSeconds - b[1].goalTimeSeconds
        : b[1].points - a[1].points
    );

    /** 順位 */
    let rank = 0;
    /** 前回の点数 */
    let prevPoints = 0;
    /** 前回のゴールタイム */
    let prevGoalTime = Infinity;
    const rankingData: RankingDatum[] = [];
    for (const v of sortedTeams) {
      if (v[1].points === prevPoints && v[1].goalTimeSeconds === prevGoalTime) {
      } else {
        rank++;
        prevPoints = v[1].points;
        prevGoalTime = v[1].goalTimeSeconds;
      }

      rankingData.push({
        rank: rank,
        teamID: v[0],
        points: v[1].points,
        goalTimeSeconds: v[1].goalTimeSeconds,
      });
    }

    return Result.ok(rankingData);
  }
}
