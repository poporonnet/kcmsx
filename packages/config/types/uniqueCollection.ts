/**
 * @description 文字列リテラル配列`Array`がユニークか検査する型
 * ユニークなら`Array`自体, 重複していたらその旨のエラーメッセージの文字列リテラル型になる
 */
export type UniqueArray<Array extends readonly string[]> =
  IsUnique<Array, "duplicated"> extends infer U
    ? U extends true
      ? Array
      : U
    : never;

/**
 * @description オブジェクトリテラル配列`Records`内のレコードの`Key`属性がユニークか検査する型
 * ユニークなら`Records`自体, 重複していたらその旨のエラーメッセージの文字列リテラル型になる
 */
export type UniqueRecords<
  Records extends Record<Key, string>[],
  Key extends keyof Records[number],
> = Key extends string
  ? IsUnique<Pickup<Records, Key>, `\`${Key}\` is duplicated`> extends infer U
    ? U extends true
      ? Records
      : U
    : never
  : never;

/**
 * @description リテラル配列`Records`内のレコードの`Key`属性を取り出した文字列リテラル配列の型
 */
type Pickup<
  Records extends Record<Key, string>[],
  Key extends keyof Records[number],
  A extends string[] = [],
> = Records extends [infer R1, ...infer RL]
  ? R1 extends Record<Key, string>
    ? RL extends Record<Key, string>[]
      ? Pickup<RL, Key, [...A, R1[Key]]>
      : never
    : never
  : A;

/**
 * @description 文字列リテラル配列`Array`の要素がユニークか検査する型
 * ユニークなら`true`, 重複していたら`{ErrorMessage}: {重複している要素}`という文字列リテラル型になる
 */
type IsUnique<
  Array extends readonly string[],
  ErrorMessage extends string,
> = Array extends readonly [infer L, ...infer Rest]
  ? Rest extends string[]
    ? L extends Rest[number]
      ? `${ErrorMessage}: \`${L}\``
      : IsUnique<Rest, ErrorMessage>
    : never
  : true;
