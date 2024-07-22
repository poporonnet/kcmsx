import { DerivedPremiseState } from "./premise";
import { UniqueRecords } from "./uniqueCollection";

/**
 * @description ルールの種別のユニオン
 * - `single`: 状態が真理値のみを持つもの e.g.`ゴールしたか否か`
 * - `count`: 状態が整数値を持つもの e.g.`持ち帰ったボールの個数`
 */
export type RuleType = "single" | "countable";

/**
 * @description {@link StateType}のキーを{@link RuleType}に制限するための型
 */
type _StateType<T extends Record<RuleType, unknown>> = T;

/**
 * @description {@link RuleType}を対応するルールの状態の型にマップする型
 */
export type StateType = _StateType<{
  single: boolean;
  countable: number;
}>;

/**
 * @description ありうるルールの状態すべてのユニオン cf. {@link StateType}
 */
export type StateTypes = StateType[RuleType];

/**
 * @description 1つのルールの型
 * @param name ルールのキー名 e.g.`leaveBase`
 * @param label ルールの表示名 e.g.`松江エリアを出た`
 * @param type ルールのタイプ cf.{@link RuleType}
 * @param initial ルールの初期状態
 * @param point 得点を計算する関数, 引数は現在の状態
 * @param validate 得点をバリデーションする関数, 引数は対象とする状態
 * @param scorable ルールによる点数が加算されるために必要な条件, この関数が`false`を返すと加点されない
 * @param visible 試合ページでの表示を決める関数, この関数が`false`を返すと表示されない
 * @param changeable 状態を変更するために必要な条件, この関数が`false`を返すと状態が変更できない
 */
export type Rule<
  Type extends RuleType,
  Initial extends StateType[Type],
> = RuleBase<Type, Initial> & RuleCondition;

/**
 * @description 1つのルールの, ルールの状態に依存する部分の型
 */
export type RuleBase<
  Type extends RuleType,
  Initial extends StateType[Type],
> = Readonly<{
  name: string;
  label: string;
  type: Type;
  initial: Initial;
  point: (value: StateType[Type]) => number;
  validate?: (value: StateType[Type]) => boolean;
}>;

/**
 * @description 1つのルールの, ルールの状態に依存する部分の型
 */
export type RuleCondition<
  MatchType extends string = string,
  DepartmentType extends string = string,
  PointState extends Record<string, unknown> = Record<string, unknown>,
> = Readonly<{
  visible?: (
    state: DerivedPremiseState<MatchType, DepartmentType, PointState>
  ) => boolean;
  changeable?: (
    state: DerivedPremiseState<MatchType, DepartmentType, PointState>
  ) => boolean;
  scorable?: (
    state: DerivedPremiseState<MatchType, DepartmentType, PointState>
  ) => boolean;
}>;

/**
 * @description 指定した{@link RuleType}に対応する{@link Rule}のユニオン
 */
type _RuleVariant<Type extends RuleType> = Type extends Type
  ? Rule<Type, StateType[Type]>
  : never;

/**
 * @description ありうる{@link Rule}すべてのユニオン
 */
type RuleVariant = _RuleVariant<RuleType>;

/**
 * @description ルールの配列の型
 */
export type RuleList = RuleVariant[];

/**
 * @description 指定した{@link RuleType}に対応する{@link RuleBase}のユニオン
 */
type _RuleBaseVariant<Type extends RuleType> = Type extends Type
  ? RuleBase<Type, StateType[Type]>
  : never;

/**
 * @description ありうる{@link RuleBase}すべてのユニオン
 */
type RuleBaseVariant = _RuleBaseVariant<RuleType>;

export type RuleBaseList = RuleBaseVariant[];

/**
 * @description ルールの初期状態の型
 */
export type DerivedInitialPointState<TRuleBase extends RuleBaseVariant> = {
  [I in TRuleBase as I["name"]]: I["initial"];
};

/**
 * @description ルールの状態の型
 */
export type DerivedPointState<TRuleBase extends RuleBaseVariant> = {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  [R in TRuleBase as R["name"]]: R extends RuleBase<infer Type, infer _Initial>
    ? StateType[Type]
    : never;
};

/**
 * @description {@link RuleList}が有効か判定する型
 * {@link Rule}の`name`属性が重複していたらコンパイルに失敗する
 */
export type ValidRuleList<R extends RuleList> =
  UniqueRecords<R, "name"> extends infer U ? (R extends U ? R : U) : never;
