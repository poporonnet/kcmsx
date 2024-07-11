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

export type StateTypes = StateType[RuleType];

/**
 * @param name ルールのキー名 e.g.`leaveBase`
 * @param label ルールの表示名 e.g.`松江エリアを出た`
 * @param type ルールのタイプ cf.{@link RuleType}
 * @param initial ルールの初期状態
 * @param point 得点を計算する関数, 引数は現在の状態
 * @param validate 得点をバリデーションする関数, 引数は対象とする状態
 * @param premise ルールの前提条件の関数, この関数が`false`を返すと加点されない
 * @param visible 試合ページでの表示を決める関数, この関数が`false`を返すと表示されない
 */
type PointRule<
  Type extends RuleType,
  Initial extends StateType[Type],
> = Readonly<{
  name: string;
  label: string;
  type: Type;
  initial: Initial;
  point: (value: StateType[Type]) => number;
  validate?: (value: StateType[Type]) => boolean;
  premise?: (premiseState: PremiseState) => boolean;
  visible?: (premiseState: PremiseState) => boolean;
}>;

type _RuleVariant<Type extends RuleType = RuleType> = Type extends Type
  ? PointRule<Type, StateType[Type]>
  : never;

type RuleVariant = _RuleVariant;

export type RuleList = RuleVariant[];


export type Rule = (typeof ruleList)[number];

export type RuleName = Rule["name"];

export type InitialPointState = {
  [I in Rule as I["name"]]: I extends { name: I["name"] }
    ? I["initial"]
    : never;
};

type _PointState = {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  [R in Rule as R["name"]]: R extends PointRule<infer Type, infer _Initial>
    ? StateType[Type]
    : never;
};

export type PointState = _PointState;

export const initialPointState: InitialPointState = Object.fromEntries(
  ruleList.map((v) => [v.name, v.initial])
) as InitialPointState;

export type PremiseState = {
  matchInfo: MatchInfo | null;
  side: keyof MatchInfo["teams"];
  judge: Judge;
};

export type ValidRuleList<R extends RuleList> = UniqueArray<R, "name">;

type UniqueArray<
  R extends Record<Key, string>[],
  Key extends keyof R[number],
> = Key extends string
  ? IsUnique<Pickup<R, Key>, `\`${Key}\` is duplicated`> extends infer U
    ? U extends true
      ? R
      : U
    : never
  : never;

type Pickup<
  R extends Record<Key, string>[],
  Key extends keyof R[number],
  A extends string[] = [],
> = R extends [infer R1, ...infer RL]
  ? R1 extends Record<Key, string>
    ? RL extends Record<Key, string>[]
      ? Pickup<RL, Key, [...A, R1[Key]]>
      : never
    : never
  : A;

type IsUnique<
  Array extends string[],
  ErrorMessage extends string,
> = Array extends [infer L, ...infer Rest]
  ? Rest extends string[]
    ? L extends Rest[number]
      ? `${ErrorMessage}: \`${L}\``
      : IsUnique<Rest, ErrorMessage>
    : never
  : true;
