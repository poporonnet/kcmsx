/**
 * @description 1つの試合種別設定の型
 */
export type MatchConfig = {
  type: string;
  name: string;
  limitSeconds: number;
};

/**
 * @description {@link MatchConfig}の配列から導出される試合種別設定のオブジェクト
 */
export type DerivedMatch<Matches extends MatchConfig[]> = {
  [M in Matches[number] as M["type"]]: Omit<M, "type">;
};
