import { DerivedMatchInfo, Side } from "./matchInfo";

export type DerivedStaticPremiseState<
  MatchType extends string,
  DepartmentType extends string,
> = {
  matchInfo?: DerivedMatchInfo<MatchType, DepartmentType>;
  side: Side;
};

type DerivedDynamicPremiseState<
  PointState extends Record<string, unknown> = Record<string, unknown>,
> = {
  matchState: MatchState<PointState>;
};

/**
 * @description 得点計算用の試合状態の型
 */
export type DerivedPremiseState<
  MatchType extends string,
  DepartmentType extends string,
  PointState extends Record<string, unknown>,
> = DerivedStaticPremiseState<MatchType, DepartmentType> &
  DerivedDynamicPremiseState<PointState>;

type MatchState<PointState extends Record<string, unknown>> = {
  [S in Side]: {
    getPointState: () => PointState;
    getGoalTimeSeconds: () => number | undefined;
  };
};
