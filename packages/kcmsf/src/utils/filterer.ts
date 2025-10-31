export type Filterer<Key extends string, Entry> = {
  [K in Key]?: (entry: Entry, state: string) => boolean;
};

export const createFilterer = <Entry, Key extends string>(
  filterer: Filterer<Key, Entry>
) => filterer;
