type Lang = Record<string, string | Record<string, string>>;

export const lang = {
  match: {
    leaveBase: "松江エリアを出た",
    overMiddle: "中間線を越えた",
    enterDistination: "金星エリアに入った",
    placeBall: "ボールを金星エリアに置いた",
    returnBase: "松江エリアに戻った",
    goal: "ゴール",
    numberOfBall: "雲粒子の数",
  },
} satisfies Lang;
