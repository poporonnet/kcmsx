import { config } from "../../config";

/**
 * @description 設定されたすべての設定の型
 */
export type Config = typeof config;

/**
 * @description 設定されたロボットのタイプのユニオン
 */
export type RobotType = Config["robotTypes"][number];

/**
 * @description 設定されたすべての部門のユニオン
 */
export type Department = Config["departments"][number];

/**
 * @description 設定されたすべての部門のタイプのユニオン
 */
export type DepartmentType = Department["type"];

/**
 * @description 設定されたすべての試合種別のユニオン
 */
export type Match = Config["matches"][number];

/**
 * @description 設定されたすべての試合種別のタイプのユニオン
 */
export type MatchType = Match["type"];
