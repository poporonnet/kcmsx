import { DerivedPremiseState } from "../premise";
import { DepartmentType, MatchType } from "./config";
import { PointState } from "./rule";

/**
 * @description 得点計算用の試合状態の型
 */
export type PremiseState = DerivedPremiseState<
  MatchType,
  DepartmentType,
  PointState
>;
