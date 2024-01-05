import { MatchInfo } from "../../pages/match";
import { ruleList } from "../rule/rule";

type StateType = boolean | number;

type PointRule<Type extends StateType, Initial extends Type> = Readonly<{
  name: string;
  point: (value: Type) => number;
  validate?: (value: Type) => boolean;
  initial?: Initial;
}>;

type _RuleVariant<Type extends StateType = StateType> = Type extends Type
  ? PointRule<Type, Type>
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

type RuleName = Rule["name"];

type RuleWithInitial = Lookup<RuleVariant, Rule, "initial", StateType>;

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
    ? Type
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
  side: keyof MatchInfo["teams"] | null;
};

type Premiser = (premiseState: PremiseState, pointState: PointState) => boolean;

export type Premise = Record<RuleName, Premiser>;
