// import { TeamInfo } from "../matchInfo";

import { DerivedMatchInfo, DerivedTeamInfo } from "../matchInfo";
import { DepartmentType, MatchType } from "./config";

export type TeamInfo = DerivedTeamInfo<DepartmentType>;
export type MatchInfo = DerivedMatchInfo<MatchType, DepartmentType>;
