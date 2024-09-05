import { teams } from "./team";

export interface RunResult {
  id: string;
  teamId: (typeof teams)[number]["id"];
  points: number;
  goalTimeSeconds?: number;
  finishState: "finished" | "retired";
}
