import { teams } from "./team";

export interface RunResult {
  id: string;
  teamID: (typeof teams)[number]["id"];
  points: number;
  goalTimeSeconds?: number;
  finishState: "finished" | "goal";
}
