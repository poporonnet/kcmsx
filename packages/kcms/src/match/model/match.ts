import { Entry, EntryID } from '../../entry/entry.js';
import { SnowflakeID } from '../../id/main.js';

export type MatchID = SnowflakeID<Match>;

// 対戦するチームのペア L左/R右
export type MatchTeams = {
  left: Entry | undefined;
  right: Entry | undefined;
};
// 試合の結果(1チーム,1回のみ)
export type MatchResult = {
  // チームのID
  teamID: EntryID;
  // 得点
  points: number;
  // ゴール時間(秒)
  time: number;
};
// 予選の結果
export type MatchResultPair = {
  left: MatchResult;
  right: MatchResult;
};
// 本選の結果
export type MatchResultFinalPair = {
  results: [MatchResultPair, MatchResultPair];
  // じゃんけんで決定したとき用
  winnerID: EntryID;
};
export const isMatchResultPair = (
  arg: MatchResultPair | MatchResultFinalPair | undefined
): arg is MatchResultPair => {
  return (arg as MatchResultPair).left !== undefined;
};

export interface CreateMatchArgs {
  id: MatchID;
  teams: MatchTeams;
  courseIndex: number;
  matchType: 'primary' | 'final';
}

export interface ReconstructMatchArgs {
  // 試合ID
  id: MatchID;
  // 試合するチームのID
  teams: MatchTeams;
  // 試合種別 primary: 予選, final: 本選
  matchType: 'primary' | 'final';
  // コース番号
  courseIndex: number;
  // 試合の結果
  results?: MatchResultPair | MatchResultFinalPair;
}

export class Match {
  // 試合ID
  private readonly id: MatchID;
  // 試合するチームのID
  private readonly teams: MatchTeams;
  // 試合種別 primary: 予選, final: 本選
  private readonly matchType: 'primary' | 'final';
  // コース番号
  private readonly courseIndex: number;
  // 試合の結果
  private results?: MatchResultPair | MatchResultFinalPair;

  private constructor(args: {
    id: MatchID;
    teams: MatchTeams;
    matchType: 'primary' | 'final';
    results?: MatchResultPair | MatchResultFinalPair;
    courseIndex: number;
  }) {
    this.id = args.id;
    this.teams = args.teams;
    this.results = args.results;
    this.matchType = args.matchType;
    this.courseIndex = args.courseIndex;
  }

  getId(): MatchID {
    return this.id;
  }

  getTeams(): MatchTeams {
    return this.teams;
  }

  getMatchType(): 'primary' | 'final' {
    return this.matchType;
  }

  getCourseIndex(): number {
    return this.courseIndex;
  }

  setResults(results: MatchResultPair | MatchResultFinalPair) {
    this.results = results;
  }

  getResults(): MatchResultPair | MatchResultFinalPair | undefined {
    return this.results;
  }

  // ToDo: Resultを返している意味がわからない
  getTime(): MatchResultPair | MatchResultFinalPair | undefined {
    return this.results;
  }

  // 既に試合が終了しているか
  public isEnd(): boolean {
    // 結果 NOT undefined -> true
    return this.results !== undefined;
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
