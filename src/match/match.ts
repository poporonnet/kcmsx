import { Entry } from "../entry/entry.js";

/*

## 試合の仕様:
### 予選
- タイムトライアル
- 2試合(左/右)必ず行う
    - 2回の試合は(同じ人が)連続して行う
- 左右の合計得点の合計とゴールタイムの合計を記録する
- 得点の上位8チーム(小学生部門: 最大16人, オープン部門: 8人)が本選に出場
- 得点が同点のチームが複数ある場合はゴールタイムで順位を決定する
    - ゴールタイムでも決まらない場合はじゃんけんで決定する
- コートは3コート
- 部門は混合で行う(同じコートで小学生部門と部門が同時に試合を行う)
- チームのコートへの配分はエントリー順に行う

### 本選
- トーナメント形式で行う
- 2試合行い、合計得点が高いほうが勝ち
    - 同点の場合はじゃんけんで決定
- コートは1コート
- 部門ごとにトーナメントを組む
- 対戦相手の決定は順位順に行う

例: 本選トーナメント
※数字は順位

                  (略)
 _|_   _|_   _|_   _|_
|   | |   | |   | |   |
1   2 3   4 5   6 7   8

*/
// 対戦するチームのペア L左/R右
export type MatchTeams = {
  Left: Entry | undefined;
  Right: Entry | undefined;
};
// 試合の結果(1チーム,1回のみ)
export type MatchResult = {
  // チームのID
  teamID: string;
  // 得点
  points: number;
  // ゴール時間(秒)
  time: number;
};
// 予選の結果
export type MatchResultPair = {
  Left: MatchResult;
  Right: MatchResult;
};
// 本選の結果
export type MatchResultFinalPair = {
  results: [MatchResultPair, MatchResultPair];
  // じゃんけんで決定したとき用
  winnerID: string;
};
export const isMatchResultPair = (
  arg: MatchResultPair | MatchResultFinalPair | undefined,
): arg is MatchResultPair => {
  return (arg as MatchResultPair).Left !== undefined;
};

export interface CreateMatchArgs {
  id: string;
  teams: MatchTeams;
  courseIndex: number;
  matchType: "primary" | "final";
}

export interface ReconstructMatchArgs {
  // 試合ID
  id: string;
  // 試合するチームのID
  teams: MatchTeams;
  // 試合種別 primary: 予選, final: 本選
  matchType: "primary" | "final";
  // コース番号
  courseIndex: number;
  // 試合の結果
  results?: MatchResultPair | MatchResultFinalPair;
}

export class Match {
  // 試合ID
  private readonly _id: string;
  // 試合するチームのID
  private readonly _teams: MatchTeams;
  // 試合種別 primary: 予選, final: 本選
  private readonly _matchType: "primary" | "final";
  // コース番号
  private readonly _courseIndex: number;
  // 試合の結果
  private _results?: MatchResultPair | MatchResultFinalPair;

  private constructor(args: {
    id: string;
    teams: MatchTeams;
    matchType: "primary" | "final";
    results?: MatchResultPair | MatchResultFinalPair;
    courseIndex: number;
  }) {
    this._id = args.id;
    this._teams = args.teams;
    this._results = args.results;
    this._matchType = args.matchType;
    this._courseIndex = args.courseIndex;
  }

  get id(): string {
    return this._id;
  }

  get teams(): MatchTeams {
    return this._teams;
  }

  get matchType(): "primary" | "final" {
    return this._matchType;
  }

  get courseIndex(): number {
    return this._courseIndex;
  }

  set results(results: MatchResultPair | MatchResultFinalPair) {
    this._results = results;
  }

  get results(): MatchResultPair | MatchResultFinalPair | undefined {
    return this._results;
  }

  get time(): MatchResultPair | MatchResultFinalPair | undefined {
    return this._results;
  }

  public static new(arg: CreateMatchArgs): Match {
    return new Match({
      id: arg.id,
      teams: arg.teams,
      matchType: arg.matchType,
      courseIndex: arg.courseIndex,
    });
  }

  public static reconstruct(args: ReconstructMatchArgs): Match {
    return new Match({
      id: args.id,
      teams: args.teams,
      matchType: args.matchType,
      courseIndex: args.courseIndex,
      results: args.results,
    });
  }
}
