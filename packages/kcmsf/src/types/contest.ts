/**
 * ランキングの1チームのレコード
 * @description 存在する走行結果のすべてでフィニッシュしている場合、`goalTimeSeconds`は`null`になる
 */
export type RankingRecord = {
  rank: number;
  teamID: string;
  teamName: string;
  points: number;
  goalTimeSeconds: number | null;
};
