import { RuleList } from "../types/rule";

export const ruleList = [
  {
    name: "multiWalk",
    label: "歩行型",
    type: "single",
    initial: false,
    point: (done: boolean) => (done ? 2 : 0),
    premise: (premiseState) =>
      premiseState.matchInfo?.teams[premiseState.side].isMultiWalk ?? true,
  },
  {
    name: "leaveBase",
    label: "松江エリアを出た",
    type: "single",
    point: (done: boolean) => (done ? 1 : 0),
    initial: false,
  },
  {
    name: "overMiddle",
    label: "中間点を超えた",
    type: "single",
    initial: false,
    point: (done: boolean) => (done ? 1 : 0),
  },
  {
    name: "enterDestination",
    label: "金星エリアに入った",
    type: "single",
    initial: false,
    point: (done: boolean) => (done ? 1 : 0),
  },
  {
    name: "placeBall",
    label: "ボールを金星エリアに置いた",
    type: "single",
    initial: false,
    point: (done: boolean) => (done ? 1 : 0),
  },
  {
    name: "returnBase",
    label: "松江エリアに戻った",
    type: "single",
    initial: false,
    point: (done: boolean) => (done ? 2 : 0),
  },
  {
    name: "bringBall",
    label: "雲粒子の数",
    type: "countable",
    initial: 0,
    point: (count: number) => count,
    validate: (value: number) => 0 <= value && value <= 3,
  },
  {
    name: "goal",
    label: "ゴール",
    type: "single",
    initial: false,
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
