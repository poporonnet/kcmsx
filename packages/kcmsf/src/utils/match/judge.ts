import {
  InitialPointState,
  PointState,
  PremiseState,
} from "../../config/types/rule";
import { MatchInfo } from "../../pages/match";
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

  team(side: keyof MatchInfo["teams"]) {
    return side === "left" ? this.leftTeam : this.rightTeam;
  }

  goalLeftTeam(goalTimeSec: number | null) {
    this._setGoalTimeSecLeft(goalTimeSec);
  }

  goalRightTeam(goalTimeSec: number | null) {
    this._setGoalTimeSecRight(goalTimeSec);
  }
}
