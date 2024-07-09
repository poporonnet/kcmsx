import { MatchInfo } from "../../pages/match";
import { Judge } from "../../utils/match/judge";
import { ruleList } from "../rule/rule";

/**
 * ルールの種別
 * - `single`: 状態が真理値のみを持つもの e.g.`ゴールしたか否か`
 * - `count`: 状態が整数値を持つもの e.g.`持ち帰ったボールの個数`
 */
type RuleType = "single" | "countable";

type _StateType<T extends Record<RuleType, any>> = T;

type StateType = _StateType<{
  single: boolean;
  countable: number;
}>;

type PointRule<
  Type extends RuleType,
  Initial extends StateType[Type],
> = Readonly<{
  name: string;
  type: Type;
  initial: Initial;
  point: (value: StateType[Type]) => number;
  validate?: (value: StateType[Type]) => boolean;
  premise?: (premiseState: PremiseState) => boolean;
}>;

type _RuleVariant<Type extends RuleType = RuleType> = Type extends Type
  ? PointRule<Type, StateType[Type]>
  : never;

type RuleVariant = _RuleVariant;

export type RuleList = RuleVariant[];

type Lookup<
  Origin,
  Target extends Origin,
  Key extends keyof Origin,
  Value extends Origin[Key],
> = Target extends Target
  ? Key extends keyof Target
    ? Target[Key] extends Value
      ? Target
      : never
    : never
  : never;

type Rule = (typeof ruleList)[number];

type RuleWithInitial = Lookup<
  RuleVariant,
  Rule,
  "initial",
  StateType[RuleType]
>;

export type InitialPointState = {
  [I in RuleWithInitial as I["name"]]: I extends { name: I["name"] }
    ? I["initial"]
    : never;
};

const isRuleWithInitial = (r: RuleVariant): r is RuleWithInitial =>
  "initial" in r && r.initial !== undefined;

type _PointState = {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  [R in Rule as R["name"]]: R extends PointRule<infer Type, infer _Initial>
    ? StateType[Type]
    : never;
};

export type PointState = _PointState;

export const initialPointState: InitialPointState = Object.fromEntries(
  ruleList.filter(isRuleWithInitial).map((v) => {
    return [v.name, v.initial];
  })
) as InitialPointState;

export type PremiseState = {
  matchInfo: MatchInfo | null;
  side: keyof MatchInfo["teams"];
  judge: Judge;
};
