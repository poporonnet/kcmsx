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
> = DerivedRule<string, string, Type, Initial>;

/**
 * @description 1つのルールの, リテラル型から導出される型
 */
export type DerivedRule<
  Name extends string,
  Label extends string,
  Type extends RuleType,
  Initial extends StateType[Type],
> = DerivedRuleBase<Name, Label, Type, Initial> & RuleCondition;

/**
 * @description {@link DerivedRuleVariant}のTypeを分割して{@link DerivedRule}にマップする型
 */
type _DerivedRuleVariant<
  Type extends RuleType,
  Initial extends StateType[Type],
  Name extends string,
  Label extends string,
> = Type extends Type
  ? DerivedRule<
      Name,
      Label,
      Type,
      Initial extends StateType[Type] ? Initial : never
    >
  : never;

/**
 * @description 指定した{@link RuleType}に対応する{@link Rule}のユニオン
 */
export type DerivedRuleVariant<
  Type extends RuleType = RuleType,
  Initial extends StateType[Type] = StateType[Type],
  Name extends string = string,
  Label extends string = string,
> = _DerivedRuleVariant<Type, Initial, Name, Label>;

/**
 * @description 1つのルールの, ルールの状態に依存する部分の型
 */
export type RuleBase<
  Type extends RuleType,
  Initial extends StateType[Type],
> = DerivedRuleBase<string, string, Type, Initial>;

/**
 * @description 1つのルールの, ルールの状態に依存する部分の, リテラル型から導出される型
 */
export type DerivedRuleBase<
  Name extends string,
  Label extends string,
  Type extends RuleType,
  Initial extends StateType[Type],
> = Readonly<{
  name: Name;
  label: Label;
  type: Type;
  initial: Initial;
  point: (value: StateType[Type]) => number;
  validate?: (value: StateType[Type]) => boolean;
}>;

/**
 * @description {@link DerivedRuleBaseVariant}のTypeを分割して{@link DerivedRuleBase}にマップする型
 */
type _DerivedRuleBaseVariant<
  Name extends string,
  Label extends string,
  Type extends RuleType,
  Initial extends StateType[Type],
> = Type extends Type
  ? DerivedRuleBase<
      Name,
      Label,
      Type,
      Initial extends StateType[Type] ? Initial : never
    >
  : never;

/**
 * @description 指定した{@link RuleType}に対応する{@link RuleBase}のユニオン
 */
export type DerivedRuleBaseVariant<
  Type extends RuleType = RuleType,
  Initial extends StateType[Type] = StateType[Type],
  Name extends string = string,
  Label extends string = string,
> = _DerivedRuleBaseVariant<Name, Label, Type, Initial>;

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
 * @description ルールの配列の型
 */
export type RuleList<
  Type extends RuleType = RuleType,
  Initial extends StateType[Type] = StateType[Type],
  Name extends string = string,
  Label extends string = string,
> = DerivedRuleVariant<Type, Initial, Name, Label>[];

export type RuleBaseList<
  Type extends RuleType = RuleType,
  Initial extends StateType[Type] = StateType[Type],
  Name extends string = string,
  Label extends string = string,
> = DerivedRuleBaseVariant<Type, Initial, Name, Label>[];

/**
 * @description ルールの初期状態の型
 */
export type DerivedInitialPointState<TRuleBase extends DerivedRuleBaseVariant> =
  {
    [I in TRuleBase as I["name"]]: I["initial"];
  };

/**
 * @description ルールの状態の型
 */
export type DerivedPointState<TRuleBase extends DerivedRuleBaseVariant> = {
  [R in TRuleBase as R["name"]]: StateType[R["type"]];
};

/**
 * @description {@link RuleList}が有効か判定する型
 * {@link Rule}の`name`属性が重複していたらコンパイルに失敗する
 */
export type ValidRuleList<
  Type extends RuleType,
  Initial extends StateType[Type],
  R extends RuleList<Type, Initial>,
> = UniqueRecords<R, "name"> extends infer U ? (R extends U ? R : U) : never;
