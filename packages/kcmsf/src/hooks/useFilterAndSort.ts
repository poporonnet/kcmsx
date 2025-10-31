import { ComboboxItem } from "@mantine/core";
import { useCallback, useState } from "react";
import { Order } from "../components/Sort";
import { Comparer } from "../utils/comparer";
import { Filterer } from "../utils/filterer";

export type FilterData<Key extends string> = Partial<
  Record<Key, ComboboxItem[]>
>;

export type FilterState<Key extends string> = Partial<Record<Key, string>>;

export type SortState<Key extends string> = {
  key?: Key;
  order?: Order;
};

export const useFilterAndSort = <Entry, Key extends string>(
  keys: readonly [Key, ...Key[]],
  filterer: Filterer<Key, Entry>,
  comparer: Comparer<Key, Entry>,
  initialFilterState?: FilterState<Key>,
  initialSortState?: SortState<Key>
) => {
  const [filterState, setFilterState] = useState<FilterState<Key>>(
    initialFilterState ?? {}
  );
  const [sortState, setSortState] = useState<SortState<Key>>(
    initialSortState ?? {}
  );

  const filter = useCallback(
    (entries: Entry[]) =>
      entries.filter((entry) =>
        keys.every(
          (key) =>
            filterState[key] == null ||
            filterer[key] == null ||
            filterer[key](entry, filterState[key])
        )
      ),
    [filterState, filterer, keys]
  );

  const sort = useCallback(
    (entries: Entry[]) => {
      const { key, order } = sortState;
      if (!key) return entries;

      const compare = comparer[key];
      if (!compare) return entries;

      const orderNumber = order == "asc" ? 1 : -1;
      return entries.toSorted((a, b) => orderNumber * compare(a, b));
    },
    [sortState, comparer]
  );

  return { filterState, setFilterState, sortState, setSortState, filter, sort };
};
