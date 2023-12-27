import { PointState, PointTable } from "../../utils/match/point";

export const actions = [
  "multiWalk",
  "leaveBase",
  "overMiddle",
  "enterDestination",
  "placeBall",
  "returnBase",
  "bringBall",
  "firstGoal",
] as const;

export const pointTable = {
  multiWalk: (done: boolean) => (done ? 2 : 0),
  leaveBase: (done: boolean) => (done ? 1 : 0),
  overMiddle: (done: boolean) => (done ? 1 : 0),
  enterDestination: (done: boolean) => (done ? 1 : 0),
  placeBall: (done: boolean) => (done ? 1 : 0),
  returnBase: (done: boolean) => (done ? 2 : 0),
  bringBall: (count: number) => count,
  firstGoal: (done: boolean) => (done ? 1 : 0),
} as const satisfies PointTable;

export const initialPointState: PointState = {
  multiWalk: false,
  leaveBase: false,
  overMiddle: false,
  enterDestination: false,
  placeBall: false,
  returnBase: false,
  bringBall: 0,
  firstGoal: false,
};
