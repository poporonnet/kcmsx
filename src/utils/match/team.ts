import { Point } from "./point";
import { PartlyPartial } from "../../types/util";
import {
  InitialPointState,
  PointState,
  PremiseState,
  initialPointState,
} from "../../config/types/rule";

export type SetGoalTimeSeconds = (goalTimeSec: number | null) => void;

export class Team {
  private readonly _point: Point;
  private _goalTimeSeconds: number | null;

  private constructor(
    _pointState: PartlyPartial<PointState, keyof InitialPointState>,
    _premiseState: PremiseState
  ) {
    this._point = new Point(
      { ...initialPointState, ..._pointState },
      _premiseState
    );
    this._goalTimeSeconds = null;
  }

  get point() {
    return this._point;
  }

  get goalTimeSeconds() {
    return this._goalTimeSeconds;
  }

  static new(
    _pointState: PartlyPartial<PointState, keyof InitialPointState>,
    _premiseState: PremiseState
  ): [Team, SetGoalTimeSeconds] {
    const team = new Team(_pointState, _premiseState);
    return [
      team,
      (goalTimeSec: number | null) => (team._goalTimeSeconds = goalTimeSec),
    ];
  }
}
