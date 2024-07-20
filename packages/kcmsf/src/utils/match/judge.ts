import { PointState } from "config/types/derived/rule";
import { MatchInfo } from "config/types/derived/matchInfo";
import { PremiseState } from "config/types/derived/premise";
import { SetGoalTimeSeconds, Team } from "./team";

export class Judge {
  private readonly _leftTeam: Team;
  private readonly _rightTeam: Team;
  private readonly _setGoalTimeSecLeft: SetGoalTimeSeconds;
  private readonly _setGoalTimeSecRight: SetGoalTimeSeconds;

  constructor(
    _leftPointState: Partial<PointState>,
    _rightPointState: Partial<PointState>,
    _leftPremiseState: Omit<PremiseState, "side" | "matchState">,
    _rightPremiseState: Omit<PremiseState, "side" | "matchState">
  ) {
    const matchState = {
      left: {
        getPointState: () => this._leftTeam.point.state,
        getGoalTimeSeconds: () => this._leftTeam.goalTimeSeconds,
      },
      right: {
        getPointState: () => this._rightTeam.point.state,
        getGoalTimeSeconds: () => this._rightTeam.goalTimeSeconds,
      },
    };
    [this._leftTeam, this._setGoalTimeSecLeft] = Team.new(_leftPointState, {
      ..._leftPremiseState,
      side: "left",
      matchState,
    });
    [this._rightTeam, this._setGoalTimeSecRight] = Team.new(_rightPointState, {
      ..._rightPremiseState,
      side: "right",
      matchState,
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

  goalLeftTeam(goalTimeSec: number | undefined) {
    this._setGoalTimeSecLeft(goalTimeSec);
  }

  goalRightTeam(goalTimeSec: number | undefined) {
    this._setGoalTimeSecRight(goalTimeSec);
  }
}
