import { TournamentRank } from './generateFinal.js';
import { Result } from '@mikuroxina/mini-fn';
import { isMatchResultPair, MatchResultPair } from '../model/match.js';
import { MatchRepository } from '../model/repository.js';
import { RunResult } from '../model/runResult.js';

export class GenerateRankingService {
  private readonly matchRepository: MatchRepository;
  constructor(matchRepository: MatchRepository) {
    this.matchRepository = matchRepository;
  }

  async handle(): Promise<TournamentRank[][]> {
    const res = await this.matchRepository.findAll();
    if (Result.isErr(res)) {
      throw res[1];
    }
    const match = Result.unwrap(res);

    // チームごとの得点/時間
    const rankBase: TournamentRank[] = [];

    // チームごとの得点を計算したい
    // -> まず全ての対戦を取得
    for (const v of match.main) {
      // 終わってない場合は飛ばす
      if (!v.getRunResults()) continue;

      // 対戦の結果を取って、tournamentRankを作る
      const left = v.getRunResults().find((vv) => vv.getTeamId() === v.getTeamId1()) as RunResult;
      const right = v.getRunResults().find((vv) => vv.getTeamId() === v.getTeamId1()) as RunResult;

      // 左チームの結果を追加
      const leftRank = rankBase.find((v) => v.entry.getId() === left.teamID);
      if (!leftRank) {
        // なければ作る
        rankBase.push(<TournamentRank>{
          rank: 0,
          points: left.getPoints(),
          time: left.getGoalTimeSeconds(),
          entry: v.getTeams().left,
        });
      } else {
        // あれば足す
        leftRank.points += left.points;
        leftRank.time += left.time;
      }

      // 右チームの結果を追加
      const rightRank = rankBase.find((v) => v.entry.getId() === right.teamID);
      if (!rightRank) {
        // なければ作る
        rankBase.push(<TournamentRank>{
          rank: 0,
          points: right.points,
          time: right.time,
          entry: v.getTeams().right,
        });
      } else {
        // あれば足す
        rightRank.points += right.points;
        rightRank.time += right.time;
      }
    }

    // 部門ごとに分ける [0]: Elementary, [1]: Open
    const categoryRank: TournamentRank[][] = [[], []];
    for (const v of rankBase) {
      if (v.entry.getCategory() === 'Elementary') {
        categoryRank[0].push(v);
      }
      if (v.entry.getCategory() === 'Open') {
        categoryRank[1].push(v);
      }
    }

    return [this.sortAndRanking(categoryRank[0]), this.sortAndRanking(categoryRank[1])];
  }

  private sortAndRanking(t: TournamentRank[]) {
    // ソートする
    t.sort((a, b) => {
      if (a.points === b.points) {
        // 得点が同じならゴールタイムが*早い順に*ソート (得点とは逆)
        return a.time - b.time;
      }
      return b.points - a.points;
    });
    // ソートが終わったら順位をつける
    return t.map((v, i) => {
      v.rank = i + 1;
      return v;
    });
  }
}
