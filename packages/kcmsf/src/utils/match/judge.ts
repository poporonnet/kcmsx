import {
  InitialPointState,
  PointState,
  PremiseState,
} from "../../config/types/rule";
import { PartlyPartial } from "../../types/util";
import { SetGoalTimeSeconds, Team } from "./team";

export class Judge {
  private readonly _leftTeam: Team;
  private readonly _rightTeam: Team;
  private readonly _setGoalTimeSecLeft: SetGoalTimeSeconds;
  private readonly _setGoalTimeSecRight: SetGoalTimeSeconds;

  constructor(
    _leftPointState: PartlyPartial<PointState, keyof InitialPointState>,
    _rightPointState: PartlyPartial<PointState, keyof InitialPointState>,
    _leftPremiseState: Omit<PremiseState, "side" | "judge">,
    _rightPremiseState: Omit<PremiseState, "side" | "judge">
  ) {
    [this._leftTeam, this._setGoalTimeSecLeft] = Team.new(_leftPointState, {
      ..._leftPremiseState,
      side: "left",
      judge: this,
    });
    [this._rightTeam, this._setGoalTimeSecRight] = Team.new(_rightPointState, {
      ..._rightPremiseState,
      side: "right",
      judge: this,
    });
  }

  get leftTeam() {
    return this._leftTeam;
  }

  get rightTeam() {
    return this._rightTeam;
  }

  goalLeftTeam(goalTimeSec: number | null) {
    this._setGoalTimeSecLeft(goalTimeSec);
    this.judgeGoalPoint();
  }

  goalRightTeam(goalTimeSec: number | null) {
    this._setGoalTimeSecRight(goalTimeSec);
    this.judgeGoalPoint();
  }

  private judgeGoalPoint() {
    const goalTimeLeft = this.leftTeam.goalTimeSeconds;
    const goalTimeRight = this.rightTeam.goalTimeSeconds;

    this.leftTeam.point.state.firstGoal = false;
    this.rightTeam.point.state.firstGoal = false;

    const setFirstGoalLeft = () => {
      this.leftTeam.point.state.firstGoal = true;
      this.rightTeam.point.state.firstGoal = false;
    };
    const setFirstGoalRight = () => {
      this.leftTeam.point.state.firstGoal = false;
      this.rightTeam.point.state.firstGoal = true;
    };

    if (goalTimeLeft != null && goalTimeRight == null) {
      setFirstGoalLeft();
      return;
    }
    if (goalTimeLeft == null && goalTimeRight != null) {
      setFirstGoalRight();
      return;
    }

    if (goalTimeLeft == null || goalTimeRight == null) {
      return;
    }

    if (goalTimeLeft < goalTimeRight) {
      setFirstGoalLeft();
      return;
    }
    if (goalTimeRight < goalTimeLeft) {
      setFirstGoalRight();
      return;
    }
  }
}
