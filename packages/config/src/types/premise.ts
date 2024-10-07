import { DerivedMatchInfo, Side } from "./matchInfo";

/**
 * @description リテラル型から導出される得点計算用の試合状態の型
 */
export type DerivedPremiseState<
  MatchType extends string,
  RobotType extends string,
  DepartmentType extends string,
  PointState extends Record<string, unknown>,
> = DerivedStaticPremiseState<MatchType, RobotType, DepartmentType> &
  DerivedDynamicPremiseState<PointState>;

/**
 * @description リテラル型から導出される得点計算用の試合状態のうち, 試合中に変化しない部分の型
 */
export type DerivedStaticPremiseState<
  MatchType extends string,
  RobotType extends string,
  DepartmentType extends string,
> = {
  matchInfo?: DerivedMatchInfo<MatchType, RobotType, DepartmentType>;
  side: Side;
};

/**
 * @description リテラル型から導出される得点計算用の試合状態のうち, 試合中に変化する部分の型
 */
type DerivedDynamicPremiseState<
  PointState extends Record<string, unknown> = Record<string, unknown>,
> = {
  matchState: {
    [S in Side]: {
      getPointState: () => PointState;
      getGoalTimeSeconds: () => number | undefined;
    };
  };
};
