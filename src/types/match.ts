import { TeamInfo } from "../pages/match";

export type Match = {
  id: string;
  courseIndex: number;
  category: "elementary" | "open";
  teams: { right: TeamInfo; left: TeamInfo };
  matchType: "primary" | "final";
  results?: {
    left: team;
    right: team;
  };
};

type team = {
  teamID: string;
  points: number;
  time: number;
};
