import { config } from "../../config";
import { DerivedInitialPointState, DerivedPointState } from "../rule";

/**
 * @description 設定されたすべてのルールのユニオン
 */
export type Rule = (typeof config)["rules"][number];

/**
 * @description 設定されたすべてのルールの`name`のユニオン
 */
export type RuleName = Rule["name"];

/**
 * @description ルールの初期状態の型
 */
export type InitialPointState = DerivedInitialPointState<Rule>;

/**
 * @description ルールの状態の型
 */
export type PointState = DerivedPointState<Rule>;

/**
 * @description ルールの初期状態のオブジェクト cf.{@link InitialPointState}
 */
export const initialPointState: InitialPointState = Object.fromEntries(
  config.rules.map((v) => [v.name, v.initial])
) as InitialPointState;
