/**
 * @description リテラル配列`TArray`内のレコードの`TKey`属性を取り出した配列の型
 */
export type Collect<
  TRecord extends Record<string, unknown>,
  TArray extends readonly TRecord[],
  TKey extends keyof TArray[number],
> = {
  [Index in keyof TArray]: TArray[Index][TKey];
};

export const pick = <
  TRecord extends Record<string, unknown>,
  TArray extends readonly [TRecord, ...TRecord[]],
  TKey extends keyof TArray[number],
>(
  array: TArray,
  key: TKey
): Collect<TRecord, TArray, TKey> =>
  array.map((o) => o[key]) as unknown as Collect<TRecord, TArray, TKey>;
