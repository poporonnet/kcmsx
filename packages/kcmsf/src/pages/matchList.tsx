import {
  Button,
  Center,
  Flex,
  List,
  Loader,
  Table,
  Text,
  Title,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { Cat } from "@mikuroxina/mini-fn";
import { IconRefresh } from "@tabler/icons-react";
import { config, DepartmentType, isMatchType, MatchType } from "config";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { CourseSelector } from "../components/courseSelector";
import { GenerateMatchButton } from "../components/GenerateMatchButton";
import {
  MatchStatusButton,
  StatusButtonProps,
} from "../components/matchStatus";
import { MatchSegmentedControl } from "../components/MatchTypeSegmentedControl";
import { GetMatchesResponse } from "../types/api/match";
import { Match } from "../types/match";

export const MatchList = () => {
  const [matches, setMatches] = useState<GetMatchesResponse>({
    pre: [],
    main: [],
  });
  const [courses, setCourses] = useState<number[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<number | "all">("all");
  const [loading, { open: startLoading, close: finishLoading }] =
    useDisclosure(false);
  const [error, setError] = useState<boolean>(false);

  const [searchParams] = useSearchParams();
  const [matchType, setMatchType] = useState<MatchType>(
    Cat.cat(searchParams.get("match_type")).feed((value) =>
      value && isMatchType(value) ? value : "pre"
    ).value
  );

  const processedMatches = useMemo(
    () =>
      Cat.cat(matches)
        .feed((matches) => matches[matchType])
        .feed((matches) =>
          selectedCourse == "all"
            ? matches
            : matches.filter(
                (match) =>
                  Number(match.matchCode.split("-")[0]) == selectedCourse
              )
        ).value,
    [matches, matchType, selectedCourse]
  );

  const fetchMatches = useCallback(async () => {
    setError(false);
    startLoading();

    const res = await fetch(`${import.meta.env.VITE_API_URL}/match`, {
      method: "GET",
    }).catch(() => undefined);

    if (!res?.ok) {
      setError(true);
      finishLoading();
      return;
    }

    const data = (await res.json()) as GetMatchesResponse;

    setMatches(data);
    setCourses([
      ...new Set(
        Object.values(data)
          .flat()
          .map((match: Match) => Number(match.matchCode.split("-")[0]))
      ),
    ]);

    finishLoading();
  }, [startLoading, finishLoading]);

  const generateMatch = useCallback(
    async (matchType: MatchType, departmentType: DepartmentType) => {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/match/${matchType}/${departmentType}/generate`,
        {
          method: "POST",
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

  useEffect(() => {
    fetchMatches();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Flex
      direction="column"
      justify="center"
      align="center"
      gap="md"
      w="fit-content"
      mx="auto"
    >
      <Title order={1} m="1rem">
        試合表
      </Title>
      <MatchSegmentedControl
        matchType={matchType}
        setMatchType={setMatchType}
      />
      {processedMatches.length > 0 && (
        <>
          <Flex w="100%" justify="right">
            <CourseSelector courses={courses} selector={setSelectedCourse} />
          </Flex>
          <Table highlightOnHover>
            <MatchHead matchType={matchType} />
            <Table.Tbody>
              {processedMatches.map((match) => (
                <MatchColumn match={match} key={match.id} />
              ))}
            </Table.Tbody>
          </Table>
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
          <Text c={"red"} fw={700}>
            サーバーからのフェッチに失敗しました。
          </Text>
          <Button mt={"2rem"} onClick={fetchMatches}>
            <IconRefresh stroke={2} />
            再読み込み
          </Button>
        </>
      )}
      {processedMatches.length === 0 && !loading && !error && (
        <>
          <Text>現在試合はありません。</Text>
          <GenerateMatchButton
            generate={async () => {
              await Promise.all(
                config.departmentTypes.map((departmentType) =>
                  generateMatch("pre", departmentType)
                )
              );
              fetchMatches();
            }}
            modalTitle="予選試合表生成確認"
            modalDetail={
              <>
                以下の試合表を生成します:
                <List withPadding>
                  {config.departmentTypes.map((departmentType) => (
                    <List.Item key={departmentType}>
                      {config.match.pre.name}&emsp;
                      {config.department[departmentType].name}
                    </List.Item>
                  ))}
                </List>
              </>
            }
          />
        </>
      )}
    </Flex>
  );
};

const MatchHead = ({ matchType }: { matchType: MatchType }) => (
  <Table.Thead>
    <Table.Tr>
      <Table.Th>試合番号</Table.Th>
      <Table.Th>コース番号</Table.Th>
      <Table.Th>{matchType == "pre" ? "左チーム" : "チーム1"}</Table.Th>
      <Table.Th>{matchType == "pre" ? "右チーム" : "チーム2"}</Table.Th>
      <Table.Th ta="center">状態</Table.Th>
    </Table.Tr>
  </Table.Thead>
);

const MatchColumn = ({ match }: { match: Match }) => {
  const matchStatus: StatusButtonProps["status"] = useMemo(() => {
    if (match.runResults.length == 0) return "future";

    const maxRunResultLength = { pre: 2, main: 4 }[match.matchType];
    return match.runResults.length < maxRunResultLength ? "now" : "end";
  }, [match.runResults, match.matchType]);

  return (
    <Table.Tr>
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
          <MatchStatusButton
            id={match.id}
            matchType={match.matchType}
            status={matchStatus}
          />
        </Center>
      </Table.Td>
    </Table.Tr>
  );
};
