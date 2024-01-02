import { Premise, RuleList } from "../types/rule";

export const ruleList = [
  {
    name: "multiWalk",
    point: (done: boolean) => (done ? 2 : 0),
  },
  {
    name: "leaveBase",
    point: (done: boolean) => (done ? 1 : 0),
    initial: false,
  },
  {
    name: "overMiddle",
    point: (done: boolean) => (done ? 1 : 0),
    initial: false,
  },
  {
    name: "enterDestination",
    point: (done: boolean) => (done ? 1 : 0),
    initial: false,
  },
  {
    name: "placeBall",
    point: (done: boolean) => (done ? 1 : 0),
    initial: false,
  },
  {
    name: "returnBase",
    point: (done: boolean) => (done ? 2 : 0),
    initial: false,
  },
  {
    name: "bringBall",
    point: (count: number) => count,
    validate: (value: number) => 0 <= value && value <= 3,
    initial: 0,
  },
  {
    name: "firstGoal",
    point: (done: boolean) => (done ? 1 : 0),
    initial: false,
  },
] as const satisfies RuleList;

export const premise = {
  multiWalk: (premiseState) =>
    premiseState.matchInfo.teams[premiseState.side].isMultiWalk,
  leaveBase: () => true,
  overMiddle: () => true,
  enterDestination: () => true,
  placeBall: () => true,
  returnBase: () => true,
  bringBall: () => true,
  firstGoal: () => true,
} satisfies Premise;
