import {
  Button,
  Flex,
  Loader,
  Stack,
  Table,
  Text,
  Title,
  Tooltip,
} from "@mantine/core";
import { Cat } from "@mikuroxina/mini-fn";
import { IconRefresh } from "@tabler/icons-react";
import { config } from "config";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  FilterAndSort,
  FilterAndSortTableHeader,
} from "../components/FilterAndSortTableHeader";
import { LoaderButton } from "../components/LoaderButton";
import { useFetch } from "../hooks/useFetch";
import { FilterData, useFilterAndSort } from "../hooks/useFilterAndSort";
import { GetTeamsResponse } from "../types/api/team";
import { Team } from "../types/team";
import { createComparer } from "../utils/comparer";
import { createFilterer } from "../utils/filterer";

const filterAndSortKeys = [
  "entryCode",
  "name",
  "clubName",
  "robotType",
  "departmentType",
  "isEntered",
] as const;

type FilterAndSortKey = (typeof filterAndSortKeys)[number];

const filterer = createFilterer<Team, FilterAndSortKey>({
  clubName: (team, state) => team.clubName === state,
  robotType: (team, state) => team.robotType === state,
  departmentType: (team, state) => team.departmentType == state,
  isEntered: (team, state) => `${team.isEntered}` === state,
});

const comparer = createComparer<Team, FilterAndSortKey>({
  entryCode: (a, b) =>
    a.entryCode.localeCompare(b.entryCode, undefined, {
      numeric: true,
    }),
  name: (a, b) => a.name.localeCompare(b.name),
  clubName: (a, b) => a.clubName.localeCompare(b.clubName),
  robotType: (a, b) => a.robotType.localeCompare(b.robotType),
  departmentType: (a, b) => a.departmentType.localeCompare(b.departmentType),
  isEntered: (a, b) => (a.isEntered ? 1 : 0) - (b.isEntered ? 1 : 0),
});

export const Teams = () => {
  const {
    data: teamsRes,
    loading,
    error,
    refetch,
  } = useFetch<GetTeamsResponse>(`${import.meta.env.VITE_API_URL}/team`);
  const [teams, setTeams] = useState<Map<string, Team>>();

  const { filterState, setFilterState, sortState, setSortState, filter, sort } =
    useFilterAndSort<Team, FilterAndSortKey>(
      filterAndSortKeys,
      filterer,
      comparer,
      {},
      { key: "entryCode", order: "asc" }
    );

  const filterData = useMemo<
    FilterData<FilterAndSortKey>
  >((): FilterData<FilterAndSortKey> => {
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

  const processedTeams = useMemo(
    () =>
      teams
        ? Cat.cat([...teams.values()])
            .feed(filter)
            .feed(sort).value
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
    setTeams(
      teamsRes && new Map(teamsRes.teams.map((team) => [team.id, team]))
    );
  }, [setTeams, teamsRes]);

  return (
    <Stack w="fit-content" align="center" gap="md">
      <Title m="md">チーム一覧</Title>
      {!loading && processedTeams && (
        <>
          <Flex w="100%" justify="right">
            <Button onClick={() => setFilterState({})} variant="outline">
              フィルターをリセット
            </Button>
          </Flex>
          <TeamTable
            teams={processedTeams}
            filterAndSort={{
              filterData,
              filterState,
              setFilterState,
              sortState,
              setSortState,
            }}
            enterable={true} // TODO: バックエンドにエントリー期間か判定する機能を作る？
            entry={entry}
          />
        </>
      )}
      {loading && (
        <>
          <Text>ロード中</Text>
          <Loader size={40} />
        </>
      )}
      {error && (
        <>
          <Text c="red" fw={700}>
            サーバーからのフェッチに失敗しました。
          </Text>
          <Button
            mt="2rem"
            onClick={refetch}
            leftSection={<IconRefresh stroke={2} />}
          >
            再読み込み
          </Button>
        </>
      )}
    </Stack>
  );
};

const TeamTable = ({
  teams,
  filterAndSort,
  enterable,
  entry,
}: {
  teams: Team[];
  filterAndSort: FilterAndSort<FilterAndSortKey>;
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
        <FilterAndSortTableHeader
          keyName="entryCode"
          label="ゼッケン"
          sortable
          {...filterAndSort}
        />
        <FilterAndSortTableHeader
          keyName="name"
          label="チーム名"
          sortable
          {...filterAndSort}
        />
        <FilterAndSortTableHeader keyName="members" label="メンバー" />
        <FilterAndSortTableHeader
          keyName="clubName"
          label="クラブ"
          sortable
          filterable
          {...filterAndSort}
        />
        <FilterAndSortTableHeader
          keyName="robotType"
          label="ロボット種別"
          sortable
          filterable
          {...filterAndSort}
        />
        <FilterAndSortTableHeader
          keyName="departmentType"
          label="部門"
          sortable
          filterable
          {...filterAndSort}
        />
        <FilterAndSortTableHeader
          keyName="isEntered"
          label="エントリー"
          sortable
          filterable
          {...filterAndSort}
        />
      </Table.Tr>
    </Table.Thead>
    <Table.Tbody>
      {teams.map((team) => (
        <TeamRow
          team={team}
          enterable={enterable}
          entry={() => entry(team.id, !team.isEntered)}
          key={team.id}
        />
      ))}
    </Table.Tbody>
  </Table>
);

const TeamRow = ({
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
