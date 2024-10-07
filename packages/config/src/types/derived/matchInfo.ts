import { DerivedMatchInfo, DerivedTeamInfo } from "../matchInfo";
import { DepartmentType, MatchType, RobotType } from "./config";

/**
 * @description チーム情報の型
 */
export type TeamInfo = DerivedTeamInfo<RobotType, DepartmentType>;

/**
 * @description 試合情報の型
 */
export type MatchInfo = DerivedMatchInfo<MatchType, RobotType, DepartmentType>;
