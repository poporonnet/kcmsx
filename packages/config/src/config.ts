import { against } from "./utility/against";
import { createConfig } from "./utility/createConfig";

export const config = createConfig(
  {
    contestName: "第2回 Matz葉がにロボコン",
    robots: [
      {
        type: "leg",
        name: "歩行型",
      },
      {
        type: "wheel",
        name: "車輪型",
      },
    ],
    departments: [
      {
        type: "elementary",
        name: "小学生部門",
        robotTypes: ["leg", "wheel"],
      },
      {
        type: "open",
        name: "オープン部門",
        robotTypes: ["leg", "wheel"],
      },
    ],
    match: {
      pre: {
        name: "予選",
        limitSeconds: 180,
        course: {
          elementary: [1, 2, 3],
          open: [],
        },
      },
      main: {
        name: "本戦",
        limitSeconds: 180,
        course: {
          elementary: [1, 2, 3],
          open: [1],
        },
        requiredTeams: {
          elementary: 4,
          open: 4,
        },
      },
    },
    rules: [
      {
        name: "multiWalk",
        label: "歩行型",
        type: "single",
        initial: true, // conditionsの"scorable"で制御する
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
        label: "中間地点を超えた",
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
        label: "金星エリアにプローブを投入した",
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
        point: (done) => (done ? 1 : 0),
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
        name: "bringRareBall",
        label: "激レアメタルの数",
        type: "countable",
        initial: 0,
        point: (count: number) => count,
        validate: (value: number) => 0 <= value && value <= 3,
      },
      {
        name: "finish",
        label: "フィニッシュ",
        type: "single",
        initial: false,
        point: () => 0,
      },
    ],
    sponsors: [],
  },
  {
    multiWalk: {
      visible: (state) => !state.matchInfo, // エキシビションモードでのみ表示
      changeable: (state) =>
        !state.matchInfo && // エキシビションモードでのみマニュアル変更可能
        !state.matchState[state.side]?.getPointState().finish,
      scorable: (state) =>
        !state.matchInfo || // エキシビションモードでは通常通り加算可能
        state.matchInfo.teams[state.side]?.robotType === "leg", // 通常の試合では歩行型のときのみ加算可能
    },
    leaveBase: {
      changeable: (state) =>
        !state.matchState[state.side]?.getPointState().finish,
    },
    overMiddle: {
      changeable: (state) =>
        !state.matchState[state.side]?.getPointState().finish,
    },
    enterDestination: {
      changeable: (state) =>
        !state.matchState[state.side]?.getPointState().finish,
    },
    placeBall: {
      changeable: (state) =>
        !state.matchState[state.side]?.getPointState().finish,
    },
    returnBase: {
      changeable: (state) =>
        !state.matchState[state.side]?.getPointState().finish,
    },
    goal: {
      changeable: (state) =>
        !state.matchState[state.side]?.getPointState().finish,
      scorable: (state) => {
        if (state.matchInfo?.matchType !== "main") return false; // 本戦以外では先ゴールに得点を与えない

        const selfTime = state.matchState[state.side]?.getGoalTimeSeconds(); // 自分のゴールタイム
        const otherTime =
          state.matchState[against(state.side)]?.getGoalTimeSeconds();

        if (selfTime == null) return false; // 自分がゴールしていないなら先ゴールでない
        if (otherTime == null) return true; // 自分がゴールしていて、相手がゴールしていないなら先ゴール
        return selfTime < otherTime; // どちらもゴールしていて、自分のゴールタイムのほうが小さければ先ゴール
      },
    },
    bringBall: {
      changeable: (state) =>
        !state.matchState[state.side]?.getPointState().finish,
    },
    bringRareBall: {
      visible: (state) =>
        !state.matchInfo || state.matchInfo.matchType === "main", // 本戦以外では激レアメタルを表示しない
      changeable: (state) =>
        !state.matchState[state.side]?.getPointState().finish,
      scorable: (state) =>
        !state.matchInfo || state.matchInfo.matchType === "main", // 本戦以外では激レアメタルに得点を与えない
    },
    finish: {
      changeable: (state) =>
        !state.matchState[state.side]?.getPointState().goal,
    },
  }
);
