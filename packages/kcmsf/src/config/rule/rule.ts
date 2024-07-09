import { Premise, RuleList } from "../types/rule";

export const ruleList = [
  {
    name: "multiWalk",
    point: (done: boolean) => (done ? 2 : 0),
    premise: (premiseState) =>
      premiseState.matchInfo?.teams[premiseState.side].isMultiWalk ?? true,
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
    premise: (premiseState) => {
      if (premiseState.matchInfo?.matchType !== "final") return false;

      const selfTime = premiseState.judge.team(
        premiseState.side
      ).goalTimeSeconds;
      const otherTime = premiseState.judge.team(
        premiseState.side === "left" ? "right" : "left"
      ).goalTimeSeconds;

      if (!selfTime) return false;
      if (!otherTime) return true;
      return selfTime < otherTime;
    },
  },
] as const satisfies RuleList;
