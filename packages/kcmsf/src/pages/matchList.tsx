import {
  Button,
  Center,
  Checkbox,
  Divider,
  Flex,
  List,
  Loader,
  Stack,
  Table,
  Text,
  Title,
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { Cat } from "@mikuroxina/mini-fn";
import { IconRefresh } from "@tabler/icons-react";
import { config, DepartmentType, MatchType } from "config";
import { useCallback, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { DepartmentSegmentedControl } from "../components/DepartmentSegmentedControl";
import {
  FilterAndSort,
  FilterAndSortTableHeader,
} from "../components/FilterAndSortTableHeader";
import { GenerateMatchButton } from "../components/GenerateMatchButton";
import { LabeledSegmentedControls } from "../components/LabeledSegmentedControls";
import {
  MatchStatusButton,
  StatusButtonProps,
} from "../components/matchStatus";
import { MatchSegmentedControl } from "../components/MatchTypeSegmentedControl";
import { useDepartmentTypeQuery } from "../hooks/useDepartmentTypeQuery";
import { useFetch } from "../hooks/useFetch";
import { FilterData, useFilterAndSort } from "../hooks/useFilterAndSort";
import { useInterval } from "../hooks/useInterval";
import { useMatchTypeQuery } from "../hooks/useMatchTypeQuery";
import { GetMatchesResponse } from "../types/api/match";
import { Match } from "../types/match";
import { createComparer } from "../utils/comparer";
import { createFilterer } from "../utils/filterer";
import { getMatchStatus } from "../utils/matchStatus";

const filterAndSortKeys = ["code", "course", "status"] as const;

type FilterAndSortKey = (typeof filterAndSortKeys)[number];

const filterer = createFilterer<Match, FilterAndSortKey>({
  course: (match, state) => match.matchCode.split("-")[0] === state,
  status: (match, state) => getMatchStatus(match) === state,
});

const comparer = createComparer<Match, FilterAndSortKey>({
  code: (a, b) => {
    const [courseA, indexA] = a.matchCode.split("-");
    const [courseB, indexB] = b.matchCode.split("-");
    const indexOrder = indexA.localeCompare(indexB, undefined, {
      numeric: true,
    });

    return indexOrder != 0
      ? indexOrder
      : courseA.localeCompare(courseB, undefined, { numeric: true });
  },
  course: (a, b) =>
    a.matchCode
      .split("-")[0]
      .localeCompare(b.matchCode.split("-")[0], undefined, {
        numeric: true,
      }),
  status: (a, b) => {
    const statuses: StatusButtonProps["status"][] = ["future", "now", "end"];
    return (
      statuses.indexOf(getMatchStatus(a)) - statuses.indexOf(getMatchStatus(b))
    );
  },
});

export const MatchList = () => {
  const {
    data: matches,
    loading,
    error,
    refetch,
  } = useFetch<GetMatchesResponse>(
    `${import.meta.env.VITE_API_URL}/match`,
    undefined,
    {
      auto: true,
      onFetch: () => setLatestFetchTime(new Date()),
    }
  );

  const [latestFetchTime, setLatestFetchTime] = useState<Date>();

  const [matchType, setMatchType] = useMatchTypeQuery(config.matchTypes[0]);
  const [departmentType, setDepartmentType] = useDepartmentTypeQuery(
    config.departmentTypes[0]
  );

  const { filterState, setFilterState, sortState, setSortState, filter, sort } =
    useFilterAndSort<Match, FilterAndSortKey>(
      filterAndSortKeys,
      filterer,
      comparer,
      {},
      { key: "course", order: "asc" }
    );

  const filterData = useMemo<FilterData<FilterAndSortKey>>(() => {
    if (!matches) return {};

    const courses = [
      ...new Set<number>(
        matches[matchType].map((match) => Number(match.matchCode.split("-")[0]))
      ),
    ];
    const course: { value: string; label: string }[] = courses.map(
      (course) => ({
        value: `${course}`,
        label: `${course}`,
      })
    );
    const status: { value: StatusButtonProps["status"]; label: string }[] = [
      { value: "future", label: "未来" },
      { value: "now", label: "進行中" },
      { value: "end", label: "完了" },
    ];

    return {
      course,
      status,
    };
  }, [matches, matchType]);

  const processedMatches = useMemo<Match[]>(
    () =>
      matches
        ? Cat.cat(matches)
            .feed((matches) => matches[matchType])
            .feed((matches) =>
              matches.filter((match) => match.departmentType == departmentType)
            )
            .feed(filter)
            .feed(sort).value
        : [],
    [matches, matchType, departmentType, sort, filter]
  );

  const generateMatch = useCallback(
    async (matchType: MatchType, departmentType: DepartmentType) => {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/match/${matchType}/${departmentType}/generate`,
        {
          method: "POST",
          credentials: "include",
        }
      ).catch(() => undefined);

      const isSucceeded = !!res?.ok;

      notifications.show({
        title: `試合表生成${isSucceeded ? "成功" : "失敗"}`,
        message: `${config.department[departmentType].name}・${config.match[matchType].name}の試合表を生成${isSucceeded ? "しました" : "できませんでした"}`,
        color: isSucceeded ? "green" : "red",
      });
    },
    []
  );

  const [isAutoRefetch, setIsAutoRefetch] = useState(true);

  useInterval(refetch, 10000, { active: isAutoRefetch });

  return (
    <Stack w="fit-content" align="center" gap="md">
      <Title m="md">試合表</Title>
      <LabeledSegmentedControls>
        <MatchSegmentedControl
          matchType={matchType}
          setMatchType={setMatchType}
        />
        <DepartmentSegmentedControl
          departmentType={departmentType}
          setDepartmentType={setDepartmentType}
        />
      </LabeledSegmentedControls>
      {matches && matches[matchType].length > 0 && (
        <>
          <Flex w="100%" justify="space-between" align="flex-end">
            <Flex justify="right" gap="lg">
              <Text size="sm">
                最終更新
                {` ${latestFetchTime?.getHours().toString().padStart(2, "0")}:${latestFetchTime?.getMinutes().toString().padStart(2, "0")}`}
              </Text>
              <Divider orientation="vertical" />
              <Checkbox
                label="自動更新"
                checked={isAutoRefetch}
                onChange={(e) => setIsAutoRefetch(e.currentTarget.checked)}
              />
            </Flex>
            <Button onClick={() => setFilterState({})} variant="outline">
              フィルターをリセット
            </Button>
          </Flex>
          <Table
            highlightOnHover
            striped
            withTableBorder
            stickyHeader
            stickyHeaderOffset={60}
            horizontalSpacing="md"
            miw="40rem"
          >
            <MatchHead
              matchType={matchType}
              filterAndSort={{
                filterData,
                filterState,
                setFilterState,
                sortState,
                setSortState,
              }}
            />
            <Table.Tbody>
              {processedMatches.map((match) => (
                <MatchRow match={match} key={match.id} />
              ))}
            </Table.Tbody>
          </Table>
        </>
      )}
      {loading && !matches && (
        <>
          <Text>ロード中</Text>
          <Loader size={40} />
        </>
      )}
      {error && (
        <>
          <Text c="red" fw={700}>
            データの取得に失敗しました。
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
      {matches?.[matchType].length === 0 && !loading && !error && (
        <>
          <Text>現在{config.match[matchType].name}試合はありません。</Text>
          <GenerateMatchButton
            generate={async () => {
              for (const departmentType of config.departmentTypes) {
                await generateMatch(matchType, departmentType);
              }
              refetch();
            }}
            modalTitle={`${config.match[matchType].name}試合表生成確認`}
            modalDetail={
              <>
                以下の試合表を生成します:
                <List withPadding>
                  {config.departmentTypes.map((departmentType) => (
                    <List.Item key={departmentType}>
                      {config.match[matchType].name}&emsp;
                      {config.department[departmentType].name}
                    </List.Item>
                  ))}
                </List>
              </>
            }
            disabled={matchType != "pre"} // TODO: 本戦試合も生成できるように
          />
        </>
      )}
    </Stack>
  );
};

const MatchHead = ({
  matchType,
  filterAndSort,
}: {
  matchType: MatchType;
  filterAndSort: FilterAndSort<FilterAndSortKey>;
}) => (
  <Table.Thead>
    <Table.Tr>
      <FilterAndSortTableHeader
        keyName="code"
        label="試合番号"
        sortable
        {...filterAndSort}
      />
      <FilterAndSortTableHeader
        keyName="course"
        label="コース番号"
        sortable
        filterable
        {...filterAndSort}
      />
      <Table.Th>{matchType == "pre" ? "左コース" : "チーム1"}</Table.Th>
      <Table.Th>{matchType == "pre" ? "右コース" : "チーム2"}</Table.Th>
      <FilterAndSortTableHeader
        keyName="status"
        label="状態"
        sortable
        filterable
        {...filterAndSort}
      />
      <Table.Th ta="center">観戦</Table.Th>
    </Table.Tr>
  </Table.Thead>
);

const MatchRow = ({ match }: { match: Match }) => {
  const matchStatus: StatusButtonProps["status"] = useMemo(() => {
    return getMatchStatus(match);
  }, [match]);

  const navigate = useNavigate();

  return (
    <Table.Tr
      onClick={() => {
        navigate(`/match/${match.matchType}/${match.id}`);
      }}
    >
      <Table.Td>
        <Text fw="bold" ta="center">
          {match.matchCode}
        </Text>
      </Table.Td>
      <Table.Td>
        <Text fw="bold" ta="center">
          {Number(match.matchCode.split("-")[0])}
        </Text>
      </Table.Td>
      <Table.Td>
        <Text fw="bold" miw={200} ta="start">
          {match.matchType == "pre"
            ? match.leftTeam?.teamName
            : match.team1?.teamName}
        </Text>
      </Table.Td>
      <Table.Td>
        <Text fw="bold" miw={200} ta="start">
          {match.matchType == "pre"
            ? match.rightTeam?.teamName
            : match.team2?.teamName}
        </Text>
      </Table.Td>
      <Table.Td>
        <Center>
          <MatchStatusButton status={matchStatus} />
        </Center>
      </Table.Td>
      <Table.Td>
        <Button
          component={Link}
          to={`/match/${match.matchType}/${match.id}/view`}
          variant="outline"
          color="green"
          radius="lg"
          size="xs"
          disabled={matchStatus === "end"}
          onClick={(event) => event.stopPropagation()}
        >
          <Text fw={700}>観戦する</Text>
        </Button>
      </Table.Td>
    </Table.Tr>
  );
};
