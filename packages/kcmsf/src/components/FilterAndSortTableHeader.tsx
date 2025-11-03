import { Flex, Space, Table } from "@mantine/core";
import { FilterData, FilterState, SortState } from "../hooks/useFilterAndSort";
import { Filter } from "./Filter";
import { Sort } from "./Sort";

export type FilterAndSort<FilterAndSortKey extends string> = {
  sortState?: SortState<FilterAndSortKey>;
  setSortState?: (sortState: SortState<FilterAndSortKey>) => void;
  filterData?: FilterData<FilterAndSortKey>;
  filterState?: FilterState<FilterAndSortKey>;
  setFilterState?: (filterState: FilterState<FilterAndSortKey>) => void;
};

export const FilterAndSortTableHeader = <FilterAndSortKey extends string>({
  keyName,
  label,
  sortable,
  filterable,
  sortState,
  setSortState,
  filterData,
  filterState,
  setFilterState,
}: {
  keyName: FilterAndSortKey;
  label: string;
  sortable?: boolean;
  filterable?: boolean;
} & FilterAndSort<FilterAndSortKey>) => (
  <Table.Th ta="center">
    <Flex direction="row" align="center" justify="center">
      {label}
      {(sortable || filterable) && <Space w={10} />}
      {sortable && sortState && setSortState && (
        <Sort
          active={sortState.key == keyName}
          defaultOrder={sortState.key == keyName ? sortState.order : undefined}
          onSort={(order) => setSortState({ key: keyName, order })}
          size={22}
          style={{ minWidth: 22 }}
        />
      )}
      {filterable && filterData && filterState && setFilterState && (
        <Filter
          active={filterState[keyName] != null}
          data={filterData[keyName] ?? []}
          value={`${filterState[keyName]}`}
          onFilter={(value) =>
            setFilterState({ ...filterState, [keyName]: value })
          }
          size={20}
          style={{ minWidth: 20 }}
        />
      )}
    </Flex>
  </Table.Th>
);
