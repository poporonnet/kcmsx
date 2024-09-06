export const pick = <
  TRecord extends Record<string, unknown>,
  TArray extends readonly [TRecord, ...TRecord[]],
  TKey extends keyof TArray[number],
>(
  array: TArray,
  key: TKey
): {
  [Index in keyof TArray]: TArray[Index][TKey];
} =>
  array.map((o) => o[key]) as unknown as {
    [Index in keyof TArray]: TArray[Index][TKey];
  };
