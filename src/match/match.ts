import { Entry } from "../entry/entry.js";

export type MatchTeams = [Entry | undefined, Entry | undefined];

export interface CreateMatchArgs {
  id: string;
  teams: MatchTeams;
  courseIndex: number;
  matchType: "primary" | "final";
}

export interface MatchPoints {
  teamID: string;
  points: number;
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
  // チームごとの得点
  private _points?: [MatchPoints, MatchPoints];
  // 勝利チームのID
  private _winnerID?: string;

  private constructor(args: {
    id: string;
    teams: MatchTeams;
    matchType: "primary" | "final";
    points?: [MatchPoints, MatchPoints];
    winnerID?: string;
    courseIndex: number;
  }) {
    this._id = args.id;
    this._teams = args.teams;
    this._points = args.points;
    this._winnerID = args.winnerID;
    this._matchType = args.matchType;
    this._courseIndex = args.courseIndex;
  }

  get id(): string {
    return this._id;
  }

  get teams(): MatchTeams {
    return this._teams;
  }

  get points(): [MatchPoints, MatchPoints] | undefined {
    return this._points;
  }

  get winnerID(): string | undefined {
    return this._winnerID;
  }

  get matchType(): "primary" | "final" {
    return this._matchType;
  }

  get courseIndex(): number {
    return this._courseIndex;
  }

  set winnerID(winnerID: string) {
    this._winnerID = winnerID;
  }

  set points(points: [MatchPoints, MatchPoints]) {
    this._points = points;
  }

  public static new(arg: CreateMatchArgs): Match {
    return new Match({
      id: arg.id,
      teams: arg.teams,
      matchType: arg.matchType,
      courseIndex: arg.courseIndex,
    });
  }
}
