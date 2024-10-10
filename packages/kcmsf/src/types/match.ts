import { TeamInfo } from "config";

export type Match = {
  id: string;
  matchCode: `${string}-${string}`;
  // category: DepartmentType;
  rightTeam?: TeamInfo;
  leftTeam?: TeamInfo;
  runResults: TeamResult[];
};

type TeamResult = {
  id: string;
  teamID: string;
  points: number;
  goalTimeSeconds: number | null;
  finishState: "finished" | "goal";
};
