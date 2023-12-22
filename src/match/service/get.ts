import { MatchRepository } from "./repository.js";
import { Option, Result } from "@mikuroxina/mini-fn";
import { Match, MatchPoints, MatchTeams } from "../match.js";

export class GetMatchService {
  private readonly repository: MatchRepository;

  constructor(repository: MatchRepository) {
    this.repository = repository;
  }

  async findById(id: string): Promise<Result.Result<Error, MatchDTO>> {
    const res = await this.repository.findByID(id);
    if (Option.isNone(res)) {
      return Result.err(new Error("Not found"));
    }

    return Result.ok(MatchDTO.fromDomain(res[1]));
  }
}

export class MatchDTO {
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
  // チームごとのゴール時間(秒)
  private _time?: [number, number];
  // 勝利チームのID
  private _winnerID?: string;

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

  get points(): [MatchPoints, MatchPoints] | undefined {
    return this._points;
  }

  get time(): [number, number] | undefined {
    return this._time;
  }

  get winnerID(): string | undefined {
    return this._winnerID;
  }

  private constructor(
    id: string,
    teams: MatchTeams,
    matchType: "primary" | "final",
    courseIndex: number,
    points?: [MatchPoints, MatchPoints] | undefined,
    time?: [number, number],
    winnerID?: string,
  ) {
    this._id = id;
    this._teams = teams;
    this._matchType = matchType;
    this._courseIndex = courseIndex;
    if (points) this._points = points;
    if (time) this._time = time;
    if (winnerID) this._winnerID = winnerID;
  }

  public static fromDomain(match: Match): MatchDTO {
    return new MatchDTO(
      match.id,
      match.teams,
      match.matchType,
      match.courseIndex,
      match.points,
      match.time,
      match.winnerID,
    );
  }

  public toDomain(): Match {
    return Match.reconstruct({
      id: this._id,
      teams: this._teams,
      matchType: this._matchType,
      courseIndex: this._courseIndex,
      points: this._points,
      time: this._time,
      winnerID: this._winnerID,
    });
  }
}
