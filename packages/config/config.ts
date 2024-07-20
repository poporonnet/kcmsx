import { createConfig } from "./utility/createConfig";

export const config = createConfig(
  {
    contestName: "第2回 Matz葉がにロボコン",
    robotTypes: ["wheel", "leg"],
    departments: [
      {
        id: 0,
        type: "elementary",
        name: "小学生部門",
        robotTypes: ["wheel", "leg"],
      },
      {
        id: 1,
        type: "open",
        name: "オープン部門",
        robotTypes: ["leg"],
      },
    ],
    matches: [
      {
        type: "pre",
        name: "予選",
        limitSeconds: 180,
      },
      {
        type: "main",
        name: "本戦",
        limitSeconds: 180,
      },
    ],
    rules: [
      {
        name: "multiWalk",
        label: "歩行型",
        type: "single",
        initial: false,
        point: (done: boolean) => (done ? 2 : 0),
      },
      {
        name: "leaveBase",
        label: "松江エリアを出た",
        type: "single",
        initial: false,
        point: (done: boolean) => (done ? 1 : 0),
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
        name: "goal",
        label: "ゴール",
        type: "single",
        initial: false,
        point: (done: boolean) => (done ? 1 : 0),
      },
      {
        name: "bringBall",
        label: "雲粒子の数",
        type: "countable",
        initial: 0,
        point: (count: number) => count,
        validate: (value: number) => 0 <= value && value <= 3,
      },
    ],
  } as const,
  {
    multiWalk: {
      visible: () => false,
    },
    goal: {
      premise: (state) => {
        if (state.matchInfo?.matchType !== "main") return false;

        const selfTime =
          state.matchState[state.side].getGoalTimeSeconds();
        const otherTime =
          state.matchState[
            state.side === "left" ? "right" : "left"
          ].getGoalTimeSeconds();

        if (selfTime == null) return false;
        if (otherTime == null) return true;
        return selfTime < otherTime;
      },
    },
  }
);
