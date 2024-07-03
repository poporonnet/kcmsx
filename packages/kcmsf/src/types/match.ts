import { TeamInfo } from "../pages/match";

export type Match = {
  id: string;
  courseIndex: number;
  category: "elementary" | "open";
  teams: { right: TeamInfo; left: TeamInfo };
  matchType: "primary" | "final";
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
