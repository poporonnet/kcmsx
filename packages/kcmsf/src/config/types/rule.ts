import { MatchInfo } from "../../pages/match";
import { Judge } from "../../utils/match/judge";
import { ruleList } from "../rule/rule";

/**
 * @description ルールの種別のユニオン
 * - `single`: 状態が真理値のみを持つもの e.g.`ゴールしたか否か`
 * - `count`: 状態が整数値を持つもの e.g.`持ち帰ったボールの個数`
 */
type RuleType = "single" | "countable";

/**
 * @description {@link StateType}のキーを{@link RuleType}に制限するための型
 */
type _StateType<T extends Record<RuleType, any>> = T;

/**
 * @description {@link RuleType}を対応するルールの状態の型にマップする型
 */
type StateType = _StateType<{
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

/**
 * @description 指定した{@link RuleType}に対応する{@link PointRule}のユニオン
 */
type _RuleVariant<Type extends RuleType> = Type extends Type
  ? PointRule<Type, StateType[Type]>
  : never;

/**
 * @description ありうる{@link PointRule}すべてのユニオン
 */
type RuleVariant = _RuleVariant<RuleType>;

/**
 * @description ルールの配列の型
 */
export type RuleList = RuleVariant[];

/**
 * @description 設定されたすべてのルールのユニオン
 */
export type Rule = (typeof ruleList)[number];

/**
 * @description 設定されたすべてのルールの`name`のユニオン
 */
export type RuleName = Rule["name"];

/**
 * @description ルールの初期状態の型
 */
export type InitialPointState = {
  [I in Rule as I["name"]]: I extends { name: I["name"] }
    ? I["initial"]
    : never;
};

/**
 * @description ルールの状態の型
 */
export type PointState = {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  [R in Rule as R["name"]]: R extends PointRule<infer Type, infer _Initial>
    ? StateType[Type]
    : never;
};

/**
 * @description ルールの初期状態のオブジェクト cf.{@link InitialPointState}
 */
export const initialPointState: InitialPointState = Object.fromEntries(
  ruleList.map((v) => [v.name, v.initial])
) as InitialPointState;

/**
 * @description 得点計算用の試合状態の型
 */
export type PremiseState = {
  matchInfo: MatchInfo | null;
  side: keyof MatchInfo["teams"];
  judge: Judge;
};

/**
 * @description {@link RuleList}が有効か判定する型  
 * {@link PointRule}の`name`属性が重複していたらコンパイルに失敗する
 */
export type ValidRuleList<R extends RuleList> = UniqueArray<R, "name">;

/**
 * @description リテラル配列`R`内のレコードの`Key`属性がユニークか検査する型  
 * ユニークなら`R`自体, 重複していたらその旨のエラーメッセージの文字列リテラル型になる
 */
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

/**
 * @description リテラル配列`R`内のレコードの`Key`属性を取り出した文字列リテラル配列の型
 */
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

/**
 * @description 文字列リテラル配列`R`の要素がユニークか検査する型  
 * ユニークなら`true`, 重複していたら`{ErrorMessage}: {重複している要素}`という文字列リテラル型になる
 */
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
