import { PointState, PremiseState, initialPointState } from "config";
import { Point } from "./point";

export type SetGoalTimeSeconds = (goalTimeSec: number | undefined) => void;

export class Team {
  private readonly _point: Point;
  private _goalTimeSeconds: number | undefined;

  private constructor(
    _pointState: Partial<PointState>,
    _premiseState: PremiseState
  ) {
    this._point = new Point(
      { ...initialPointState, ..._pointState },
      _premiseState
    );
    this._goalTimeSeconds = undefined;
  }

  get point() {
    return this._point;
  }

  get goalTimeSeconds() {
    return this._goalTimeSeconds;
  }

  static new(
    _pointState: Partial<PointState>,
    _premiseState: PremiseState
  ): [Team, SetGoalTimeSeconds] {
    const team = new Team(_pointState, _premiseState);
    return [
      team,
      (goalTimeSec: number | undefined) =>
        (team._goalTimeSeconds = goalTimeSec),
    ];
  }
}
