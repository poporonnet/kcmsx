import { TournamentRank } from './generateFinal.js';
import { Result } from '@mikuroxina/mini-fn';
import { isMatchResultPair } from '../match.js';
import { MatchRepository } from './repository.js';

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
    // チームごとの得点/時間
    const rankBase: TournamentRank[] = [];
    // チームごとの得点を計算したい
    // -> まず全ての対戦を取得
    for (const v of res[1]) {
      // 本選は関係ないので飛ばす
      if (v.matchType !== 'primary') continue;
      // 終わってない場合は飛ばす
      if (!v.isEnd() || !v.results) continue;
      // ToDo: Match.categoryがprimaryのときはMatchResultPairに必ずなるようにする
      if (!isMatchResultPair(v.results)) continue;
      // 対戦の結果を取って、tournamentRankを作る
      const left = v.results.left;
      const right = v.results.right;

      // 左チームの結果を追加
      const leftRank = rankBase.find((v) => v.entry.id === left.teamID);
      if (!leftRank) {
        // なければ作る
        rankBase.push(<TournamentRank>{
          rank: 0,
          points: left.points,
          time: left.time,
          entry: v.teams.left,
        });
      } else {
        // あれば足す
        leftRank.points += left.points;
        leftRank.time += left.time;
      }

      // 右チームの結果を追加
      const rightRank = rankBase.find((v) => v.entry.id === right.teamID);
      if (!rightRank) {
        // なければ作る
        rankBase.push(<TournamentRank>{
          rank: 0,
          points: right.points,
          time: right.time,
          entry: v.teams.right,
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
      if (v.entry.category === 'Elementary') {
        categoryRank[0].push(v);
      }
      if (v.entry.category === 'Open') {
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
