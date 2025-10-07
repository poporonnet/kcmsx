import { PointState } from "config";
import { Side } from "config/src/types/matchInfo";
import { TimerState } from "../hooks/useMatchTimer";

export type MatchEventType =
  | "TEAM_POINT_STATE_UPDATED"
  | "TEAM_GOAL_TIME_UPDATED"
  | "TIMER_UPDATED"
  | "MATCH_ENDED";

type _RestrictMatchEvent<T extends { type: MatchEventType }> = T;

export type MatchEventTeamPointStateUpdated = _RestrictMatchEvent<{
  type: "TEAM_POINT_STATE_UPDATED";
  side: Side;
  pointState: PointState;
}>;

export type MatchEventTeamGoalTimeUpdated = _RestrictMatchEvent<{
  type: "TEAM_GOAL_TIME_UPDATED";
  side: Side;
  goalTimeSeconds: number | undefined;
}>;

export type MatchEventTimerUpdated = _RestrictMatchEvent<{
  type: "TIMER_UPDATED";
  totalSeconds?: number;
  isRunning?: boolean;
  state?: TimerState;
}>;

export type MatchEventMatchEnded = _RestrictMatchEvent<{
  type: "MATCH_ENDED";
}>;

export type MatchEvent = _RestrictMatchEvent<
  | MatchEventTeamPointStateUpdated
  | MatchEventTeamGoalTimeUpdated
  | MatchEventTimerUpdated
  | MatchEventMatchEnded
>;
