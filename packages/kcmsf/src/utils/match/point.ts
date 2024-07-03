import { premise, ruleList } from "../../config/rule/rule";
import { PointState, PremiseState } from "../../config/types/rule";

export class Point {
  private readonly _state: PointState;
  private readonly _premiseState: PremiseState;

  constructor(_state: PointState, _premiseState: PremiseState) {
    this._state = _state;
    this._premiseState = _premiseState;
  }

  get state() {
    return this._state;
  }

  public point(): number {
    let point = 0;
    ruleList.forEach((rule) => {
      if (!premise[rule.name](this._premiseState)) return;

      point += rule.point(this.state[rule.name] as never);
    });

    return point;
  }
}
