import {
  config,
  initialPointState,
  PointState,
  PremiseState,
  RuleName,
} from "config";

export class Point {
  private readonly _state: PointState;
  private readonly _premiseState: PremiseState;

  constructor(_state: PointState, _premiseState: PremiseState) {
    this._state = _state;
    this._premiseState = _premiseState;
  }

  get state(): Readonly<PointState> {
    return this._state;
  }

  get premiseState(): Readonly<PremiseState> {
    return this._premiseState;
  }

  public point(): number {
    return config.rules
      .map((rule): number => {
        if (rule.scorable && !rule.scorable(this._premiseState)) return 0;

        return rule.point(this.state[rule.name] as never);
      })
      .reduce((sum, point) => (sum += point), 0);
  }

  public set<Name extends RuleName>(name: Name, value: PointState[Name]): void {
    this._state[name] = value;
  }

  public reset(state: PointState = initialPointState): void {
    config.rules.forEach((rule) => {
      this._state[rule.name] = state[rule.name] as never;
    });
  }
}
