import {
  Button,
  ComboboxItem,
  Flex,
  Loader,
  Space,
  Table,
  Text,
  Title,
  Tooltip,
} from "@mantine/core";
import { Cat } from "@mikuroxina/mini-fn";
import { config, RobotType } from "config";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Filter } from "../components/Filter";
import { LoaderButton } from "../components/LoaderButton";
import { Order, Sort } from "../components/Sort";
import { GetTeamsResponse } from "../types/api/team";
import { Team } from "../types/team";

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
  const [teams, setTeams] = useState<Map<string, Team>>();
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
      departmentType: (a, b) => a.localeCompare(b),
      isEntered: (a, b) => (a ? 1 : 0) - (b ? 1 : 0),
    }),
    []
  );

  const filterData = useMemo<FilterData>((): FilterData => {
    if (!teams) return {};

    const clubNames = [
      ...new Set<string>(
        [...teams.values()]
          .map((team) => team.clubName)
          .filter((value) => value != "")
      ),
    ].sort((a, b) => a.localeCompare(b));
    const clubName: { value: string; label: string }[] = clubNames
      .map((clubName) => ({
        value: clubName,
        label: clubName,
      }))
      .concat([{ value: "", label: "(所属なし)" }]);
    const robotType = config.robots.map(({ type, name }) => ({
      value: type,
      label: name,
    }));
    const departmentType = config.departments.map(({ type, name }) => ({
      value: type,
      label: name,
    }));
    const isEntered: { value: string; label: string }[] = [
      { value: `${false}`, label: "未エントリー" },
      { value: `${true}`, label: "エントリー済み" },
    ];

    return {
      clubName,
      robotType,
      departmentType,
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
    () =>
      teams
        ? Cat.cat([...teams.values()])
            .feed(sort)
            .feed(filter).value
        : undefined,
    [teams, sort, filter]
  );

  const entry = useCallback(
    async (teamID: string, isEnter: boolean) => {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/team/${teamID}/entry`,
        {
          method: isEnter ? "POST" : "DELETE",
        }
      );
      if (!response.ok) return;

      setTeams((prev) => {
        if (!prev) return prev;

        const team = prev.get(teamID);
        if (!team) return prev;

        team.isEntered = isEnter;
        prev.set(teamID, team);

        return new Map(prev);
      });
    },
    [setTeams]
  );

  useEffect(() => {
    const getTeams = async () => {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/team`, {
        method: "GET",
      }).catch(() => undefined);
      const teamResponse = (await response?.json()) as
        | GetTeamsResponse
        | undefined;

      setTeams(
        teamResponse
          ? new Map(teamResponse.teams.map((team) => [team.id, team]))
          : undefined
      );
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
            enterable={true} // TODO: バックエンドにエントリー期間か判定する機能を作る？
            entry={entry}
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
  entry,
}: {
  teams: Team[];
  sortState: SortState;
  setSortState: (sortState: SortState) => void;
  filterData: FilterData;
  filterState: FilterState;
  setFilterState: (filterState: FilterState) => void;
  enterable: boolean;
  entry: (teamID: string, isEnter: boolean) => Promise<void>;
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
          keyName="departmentType"
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
      {teams.map((team) => (
        <TeamColumn
          team={team}
          enterable={enterable}
          entry={() => entry(team.id, !team.isEntered)}
          key={team.id}
        />
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
  entry,
}: {
  team: Team;
  enterable: boolean;
  entry: () => Promise<void>;
}) => (
  <Table.Tr>
    <Table.Td>{team.entryCode}</Table.Td>
    <Table.Td>{team.name}</Table.Td>
    <Table.Td>{team.members.join(", ")}</Table.Td>
    <Table.Td>{team.clubName}</Table.Td>
    <Table.Td>{team.robotType == "leg" ? "歩行型" : "車輪型"}</Table.Td>
    <Table.Td>{config.department[team.departmentType].name}</Table.Td>
    <Table.Td>
      <Flex direction="row" justify="center">
        <Tooltip
          label={
            enterable
              ? "クリックしてエントリー"
              : "エントリー期間ではありません"
          }
        >
          {enterable ? (
            <LoaderButton
              load={entry}
              variant={team.isEntered ? "filled" : "outline"}
            >
              {team.isEntered ? "エントリー済み" : "エントリーする"}
            </LoaderButton>
          ) : (
            <Text c={team.isEntered ? "blue" : "red"}>
              {team.isEntered ? "エントリー済み" : "未エントリー"}
            </Text>
          )}
        </Tooltip>
      </Flex>
    </Table.Td>
  </Table.Tr>
);
