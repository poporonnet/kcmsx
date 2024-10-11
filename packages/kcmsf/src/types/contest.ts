/**
 * ランキングの1チームのレコード
 */
export type RankingRecord = {
  rank: number;
  teamID: string;
  teamName: string;
  points: number;
  goalTimeSeconds: number;
};
