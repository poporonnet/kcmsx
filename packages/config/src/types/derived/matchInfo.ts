import { DerivedMatchInfo, DerivedTeamInfo } from "../matchInfo";
import { DepartmentType, MatchType } from "./config";

/**
 * @description チーム情報の型
 */
export type TeamInfo = DerivedTeamInfo<DepartmentType>;

/**
 * @description 試合情報の型
 */
export type MatchInfo = DerivedMatchInfo<MatchType, DepartmentType>;
