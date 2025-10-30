import {
  Button,
  Center,
  Checkbox,
  ComboboxItem,
  Divider,
  Flex,
  List,
  Loader,
  Space,
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
import { Filter } from "../components/Filter";
import { GenerateMatchButton } from "../components/GenerateMatchButton";
import { LabeledSegmentedControls } from "../components/LabeledSegmentedControls";
import {
  MatchStatusButton,
  StatusButtonProps,
} from "../components/matchStatus";
import { MatchSegmentedControl } from "../components/MatchTypeSegmentedControl";
import { Order, Sort } from "../components/Sort";
import { useDepartmentTypeQuery } from "../hooks/useDepartmentTypeQuery";
import { useFetch } from "../hooks/useFetch";
import { useInterval } from "../hooks/useInterval";
import { useMatchTypeQuery } from "../hooks/useMatchTypeQuery";
import { GetMatchesResponse } from "../types/api/match";
import { Match } from "../types/match";
import { getMatchStatus } from "../utils/matchStatus";

type Comparer = {
  [K in keyof FilterState]?: (a: Match, b: Match) => number;
};

type FilterData = Partial<Record<keyof FilterState, ComboboxItem[]>>;

type FilterState = Partial<{
  code: string;
  course: string;
  status: StatusButtonProps["status"];
}>;

type SortState = {
  key?: keyof FilterState;
  order?: Order;
};

export const MatchList = () => {
  const {
    data: matches,
    loading,
    error,
    refetch,
  } = useFetch<GetMatchesResponse>(`${import.meta.env.VITE_API_URL}/match`);
  const [matchType, setMatchType] = useMatchTypeQuery(config.matchTypes[0]);
  const [departmentType, setDepartmentType] = useDepartmentTypeQuery(
    config.departmentTypes[0]
  );

  const [sortState, setSortState] = useState<SortState>({
    key: "course",
    order: "asc",
  });
  const [filterState, setFilterState] = useState<FilterState>({});

  const comparer: Comparer = useMemo(
    () => ({
      code: (a, b) => {
        const [courseA, indexA] = a.matchCode.split("-");
        const [courseB, indexB] = b.matchCode.split("-");

        const indexOrder = indexA.localeCompare(indexB, undefined, {
          numeric: true,
        });
        if (indexOrder != 0) return indexOrder;

        return courseA.localeCompare(courseB, undefined, { numeric: true });
      },
      course: (a, b) =>
        a.matchCode
          .split("-")[0]
          .localeCompare(b.matchCode.split("-")[0], undefined, {
            numeric: true,
          }),
      status: (a, b) => {
        const statuses: StatusButtonProps["status"][] = [
          "future",
          "now",
          "end",
        ];
        return (
          statuses.indexOf(getMatchStatus(a)) -
          statuses.indexOf(getMatchStatus(b))
        );
      },
    }),
    []
  );

  const filterData = useMemo<FilterData>((): FilterData => {
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

  const sort = useCallback(
    (matches: Match[]) => {
      const { key, order } = sortState;
      if (!key) return matches;

      const compare = comparer[key];
      if (!compare) return matches;

      const orderNumber = order == "asc" ? 1 : -1;
      return matches.sort((a, b) => orderNumber * compare(a, b));
    },
    [sortState, comparer]
  );

  const filter = useCallback(
    (matches: Match[]) =>
      matches.filter(
        (match) =>
          (filterState.status == null ||
            getMatchStatus(match) === filterState.status) &&
          (filterState.course == null ||
            match.matchCode.split("-")[0] === filterState.course)
      ),
    [filterState]
  );

  const processedMatches = useMemo<Match[]>(
    () =>
      matches
        ? Cat.cat(matches)
            .feed((matches) => matches[matchType])
            .feed((matches) =>
              matches.filter((match) => match.departmentType == departmentType)
            )
            .feed(sort)
            .feed(filter).value
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
  const latestFetchTime = useMemo(() => new Date(), [matches]);

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
              sortState={sortState}
              setSortState={setSortState}
              filterData={filterData}
              filterState={filterState}
              setFilterState={setFilterState}
            />
            <Table.Tbody>
              {processedMatches.map((match) => (
                <MatchColumn match={match} key={match.id} />
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
  sortState,
  setSortState,
  filterData,
  filterState,
  setFilterState,
}: {
  matchType: MatchType;
  sortState: SortState;
  setSortState: (sortState: SortState) => void;
  filterData: FilterData;
  filterState: FilterState;
  setFilterState: (filterState: FilterState) => void;
}) => (
  <Table.Thead>
    <Table.Tr>
      <MatchHeader
        keyName="code"
        label="試合番号"
        sortable
        sortState={sortState}
        setSortState={setSortState}
      />
      <MatchHeader
        keyName="course"
        label="コース番号"
        sortable
        sortState={sortState}
        setSortState={setSortState}
        filterable
        filterData={filterData}
        filterState={filterState}
        setFilterState={setFilterState}
      />
      <Table.Th>{matchType == "pre" ? "左コース" : "チーム1"}</Table.Th>
      <Table.Th>{matchType == "pre" ? "右コース" : "チーム2"}</Table.Th>
      <MatchHeader
        keyName="status"
        label="状態"
        sortable
        sortState={sortState}
        setSortState={setSortState}
        filterable
        filterData={filterData}
        filterState={filterState}
        setFilterState={setFilterState}
      />
      <Table.Th ta="center">観戦</Table.Th>
    </Table.Tr>
  </Table.Thead>
);

const MatchHeader = ({
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
  keyName: keyof FilterState;
  label: string;
  sortable?: boolean;
  filterable?: boolean;
  sortState?: SortState;
  setSortState?: (sortState: SortState) => void;
  filterData?: FilterData;
  filterState?: FilterState;
  setFilterState?: (filterState: FilterState) => void;
}) => (
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

const MatchColumn = ({ match }: { match: Match }) => {
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
