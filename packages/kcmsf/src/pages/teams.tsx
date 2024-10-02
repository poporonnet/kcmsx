import {
  Button,
  Checkbox,
  ComboboxItem,
  Flex,
  Loader,
  Space,
  Table,
  Title,
  Tooltip,
} from "@mantine/core";
import { Cat } from "@mikuroxina/mini-fn";
import { config, DepartmentType, RobotType } from "config";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Filter } from "../components/Filter";
import { Order, Sort } from "../components/Sort";

type Team = {
  id: string;
  name: string;
  entryCode: string;
  members: string[];
  clubName: string;
  robotType: RobotType;
  category: DepartmentType;
  isEntered: boolean;
};

type TeamResponse = {
  teams: Team[];
};

type Comparer = {
  [K in keyof Team]?: (a: Team[K], b: Team[K]) => number;
};

type FilterData = Partial<Record<keyof Team, ComboboxItem[]>>;

type SortState = {
  key?: keyof Team;
  order?: Order;
};

type FilterState = Partial<Team>;

export const Teams = () => {
  const [teams, setTeams] = useState<Team[]>();
  const [sortState, setSortState] = useState<SortState>({
    key: "entryCode",
    order: "asc",
  });
  const [filterState, setFilterState] = useState<FilterState>({});

  const comparer: Comparer = useMemo(
    () => ({
      entryCode: (a, b) => a.localeCompare(b),
      name: (a, b) => a.localeCompare(b),
      clubName: (a, b) => a.localeCompare(b),
      robotType: (a, b) => a.localeCompare(b),
      category: (a, b) => a.localeCompare(b),
      isEntered: (a, b) => (a ? 1 : 0) - (b ? 1 : 0),
    }),
    []
  );

  const filterData: FilterData = useMemo(() => {
    if (!teams) return {};

    const clubNames = [
      ...new Set<string>(
        teams.map((team) => team.clubName).filter((value) => value != "")
      ),
    ].sort((a, b) => a.localeCompare(b));
    const clubName: { value: string; label: string }[] = clubNames
      .map((clubName) => ({
        value: clubName,
        label: clubName,
      }))
      .concat([{ value: "", label: "(所属なし)" }]);
    const robotType: { value: RobotType; label: string }[] = [
      { value: "leg", label: "歩行型" },
      { value: "wheel", label: "車輪型" },
    ];
    const category: { value: DepartmentType; label: string }[] = [
      { value: "elementary", label: config.department["elementary"].name },
      { value: "open", label: config.department["open"].name },
    ];
    const isEntered: { value: string; label: string }[] = [
      { value: `${false}`, label: "未エントリー" },
      { value: `${true}`, label: "エントリー済み" },
    ];

    return {
      clubName,
      robotType,
      category,
      isEntered,
    };
  }, [teams]);

  const sort = useCallback(
    (teams: Team[]) => {
      const { key, order } = sortState;
      if (!key) return teams;

      const compare = comparer[key];
      if (!compare) return teams;

      const orderNumber = order == "asc" ? 1 : -1;
      return teams.sort(
        (a, b) => orderNumber * compare(a[key] as never, b[key] as never)
      );
    },
    [sortState, comparer]
  );

  const filter = useCallback(
    (teams: Team[]) => {
      return teams.filter((team) =>
        (Object.keys(team) as (keyof Team)[]).every(
          (key) =>
            filterState[key] == null || `${filterState[key]}` === `${team[key]}`
        )
      );
    },
    [filterState]
  );

  const processedTeams = useMemo(
    () => (teams ? Cat.cat(teams).feed(sort).feed(filter).value : undefined),
    [teams, sort, filter]
  );

  useEffect(() => {
    const getTeams = async () => {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/team`, {
        method: "GET",
      }).catch(() => undefined);
      const teamResponse = (await response?.json()) as TeamResponse | undefined;

      setTeams(teamResponse?.teams);
    };
    getTeams();
  }, []);

  return (
    <Flex direction="column" align="center" justify="center">
      <Title m="md">チーム一覧</Title>
      <Space h={20} />
      {processedTeams ? (
        <>
          <Flex w="100%" justify="right">
            <Button onClick={() => setFilterState({})} variant="outline">
              フィルターをリセット
            </Button>
          </Flex>
          <Space h={10} />
          <TeamTable
            teams={processedTeams}
            sortState={sortState}
            setSortState={setSortState}
            filterData={filterData}
            filterState={filterState}
            setFilterState={setFilterState}
            enterable={false}
          />
        </>
      ) : (
        <Loader m="xl" />
      )}
    </Flex>
  );
};

const TeamTable = ({
  teams,
  sortState,
  setSortState,
  filterData,
  filterState,
  setFilterState,
  enterable,
}: {
  teams: Team[];
  sortState: SortState;
  setSortState: (sortState: SortState) => void;
  filterData: FilterData;
  filterState: FilterState;
  setFilterState: (filterState: FilterState) => void;
  enterable: boolean;
}) => (
  <Table
    striped
    withTableBorder
    stickyHeader
    stickyHeaderOffset={60}
    horizontalSpacing="md"
  >
    <Table.Thead>
      <Table.Tr>
        <TeamHeader
          keyName="entryCode"
          label="ゼッケン"
          sortable
          sortState={sortState}
          setSortState={setSortState}
        />
        <TeamHeader
          keyName="name"
          label="チーム名"
          sortable
          sortState={sortState}
          setSortState={setSortState}
        />
        <TeamHeader keyName="members" label="メンバー" />
        <TeamHeader
          keyName="clubName"
          label="クラブ"
          sortable
          sortState={sortState}
          setSortState={setSortState}
          filterable
          filterData={filterData}
          filterState={filterState}
          setFilterState={setFilterState}
        />
        <TeamHeader
          keyName="robotType"
          label="ロボット種別"
          sortable
          sortState={sortState}
          setSortState={setSortState}
          filterable
          filterData={filterData}
          filterState={filterState}
          setFilterState={setFilterState}
        />
        <TeamHeader
          keyName="category"
          label="部門"
          sortable
          sortState={sortState}
          setSortState={setSortState}
          filterable
          filterData={filterData}
          filterState={filterState}
          setFilterState={setFilterState}
        />
        <TeamHeader
          keyName="isEntered"
          label="エントリー"
          sortable
          sortState={sortState}
          setSortState={setSortState}
          filterable
          filterData={filterData}
          filterState={filterState}
          setFilterState={setFilterState}
        />
      </Table.Tr>
    </Table.Thead>
    <Table.Tbody>
      {teams.map((team, i) => (
        <TeamColumn team={team} enterable={enterable} key={`${team.id}-${i}`} />
      ))}
    </Table.Tbody>
  </Table>
);

const TeamHeader = ({
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
  keyName: keyof Team;
  label: string;
  sortable?: boolean;
  filterable?: boolean;
  sortState?: SortState;
  setSortState?: (sortState: SortState) => void;
  filterData?: FilterData;
  filterState?: FilterState;
  setFilterState?: (filterState: FilterState) => void;
}) => (
  <Table.Th style={{ textAlign: "center" }}>
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
          label={label}
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

const TeamColumn = ({
  team,
  enterable,
}: {
  team: Team;
  enterable: boolean;
}) => (
  <Table.Tr>
    <Table.Td>{team.entryCode}</Table.Td>
    <Table.Td>{team.name}</Table.Td>
    <Table.Td>{team.members.join(", ")}</Table.Td>
    <Table.Td>{team.clubName}</Table.Td>
    <Table.Td>{team.robotType == "leg" ? "歩行型" : "車輪型"}</Table.Td>
    <Table.Td>{config.department[team.category].name}</Table.Td>
    <Table.Td>
      <Flex direction="row" justify="center">
        <Tooltip label={enterable ? "クリックしてエントリー" : "変更不可"}>
          <Checkbox
            {...(enterable
              ? { defaultChecked: team.isEntered }
              : {
                  checked: team.isEntered,
                  readOnly: true,
                  disabled: !team.isEntered,
                })}
          />
        </Tooltip>
      </Flex>
    </Table.Td>
  </Table.Tr>
);
