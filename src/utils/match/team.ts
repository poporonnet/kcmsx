import { initialPointState } from "../../config/rule/rule";
import { Point, PointState } from "./point";

export type SetGoalTimeSeconds = (goalTimeSec: number | null) => void;

export class Team {
  private readonly _point: Point;
  private _goalTimeSeconds: number | null;

  private constructor(_pointState?: Partial<PointState>) {
    this._point = new Point({ ...initialPointState, ..._pointState });
    this._goalTimeSeconds = null;
  }

  get point() {
    return this._point;
  }

  get goalTimeSeconds() {
    return this._goalTimeSeconds;
  }

  static new(_pointState?: Partial<PointState>): [Team, SetGoalTimeSeconds] {
    const team = new Team(_pointState);
    return [
      team,
      (goalTimeSec: number | null) => (team._goalTimeSeconds = goalTimeSec),
    ];
  }
}
