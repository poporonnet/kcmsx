import { UniqueRecords } from "./uniqueCollection";

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

/**
 * @description {@link Matches}が有効か判定する型
 * {@link MatchConfig}の`type`属性が重複していたらコンパイルに失敗する
 */
export type ValidMatchConfigs<Matches extends MatchConfig[]> =
  UniqueRecords<Matches, "type"> extends infer U
    ? Matches extends U
      ? Matches
      : U
    : never;
