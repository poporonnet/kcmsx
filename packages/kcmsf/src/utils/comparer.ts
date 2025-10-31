export type Comparer<Key extends string, Entry> = {
  [K in Key]?: (a: Entry, b: Entry) => number;
};

export const createComparer = <Entry, Key extends string>(
  comparer: Comparer<Key, Entry>
) => comparer;
