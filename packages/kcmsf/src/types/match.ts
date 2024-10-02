import { DepartmentType, MatchType, TeamInfo } from "config";

export type Match = {
  id: string;
  courseIndex: number;
  category: DepartmentType;
  right: TeamInfo;
  left: TeamInfo;
  matchType: MatchType;
  results?: {
    left: TeamResult;
    right: TeamResult;
  };
};

type TeamResult = {
  teamID: string;
  points: number;
  time: number;
};
