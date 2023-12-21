import { actions, pointTable } from "./rule";

type Action = (typeof actions)[number];
type PointCalculator =
  | ((done: boolean) => number)
  | ((count: number) => number);
export type PointTable = Record<Action, PointCalculator>;
export type PointState = {
  [A in Action]: Parameters<(typeof pointTable)[A]>["0"];
};

export class Point {
  private readonly _state: PointState;

  constructor(_state: PointState) {
    this._state = _state;
  }

  get state() {
    return this._state;
  }

  public point(): number {
    let point = 0;
    actions.forEach((action: Action) => {
      const calculator = pointTable[action];
      point += calculator(this._state[action] as never);
    });

    return point;
  }
}
