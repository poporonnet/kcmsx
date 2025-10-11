// FIXME: 雑実装

import {
  Button,
  Center,
  Flex,
  Loader,
  Stack,
  Table,
  Text,
  Title,
} from "@mantine/core";
import { Cat } from "@mikuroxina/mini-fn";
import { IconRefresh } from "@tabler/icons-react";
import { config, MatchType } from "config";
import { useMemo, useState } from "react";
import { CourtFilter, CourtSelector } from "../components/CourtSelector";
import { DepartmentSegmentedControl } from "../components/DepartmentSegmentedControl";
import { LabeledSegmentedControls } from "../components/LabeledSegmentedControls";
import {
  MatchStatusButton,
  StatusButtonProps,
} from "../components/matchStatus";
import { MatchSegmentedControl } from "../components/MatchTypeSegmentedControl";
import { useDepartmentTypeQuery } from "../hooks/useDepartmentTypeQuery";
import { useFetch } from "../hooks/useFetch";
import { useMatchTypeQuery } from "../hooks/useMatchTypeQuery";
import { GetMatchesPublicResponse } from "../types/api/match";
import { Match } from "../types/match";
import { getMatchStatus } from "../utils/matchStatus";

export const PublicMatchList = () => {
  const {
    data: matches,
    loading,
    error,
    refetch,
  } = useFetch<GetMatchesPublicResponse>(
    `${import.meta.env.VITE_API_URL}/match/public`,
    { credentials: "omit" }
  );
  const courts = useMemo(
    () =>
      [
        ...new Set(
          Object.values(matches ?? {})
            .flat()
            .map((match: Match) => Number(match.matchCode.split("-")[0]))
        ),
      ].sort(),
    [matches]
  );
  const [selectedCourt, setSelectedCourt] = useState<CourtFilter>("all");
  const [matchType, setMatchType] = useMatchTypeQuery(config.matchTypes[0]);
  const [departmentType, setDepartmentType] = useDepartmentTypeQuery(
    config.departmentTypes[0]
  );

  const processedMatches = useMemo<Match[]>(
    () =>
      matches
        ? Cat.cat(matches)
            .feed((matches) => matches[matchType])
            .feed((matches) =>
              matches.filter((match) => match.departmentType == departmentType)
            )
            .feed((matches) =>
              selectedCourt == "all"
                ? matches
                : matches.filter(
                    (match) =>
                      Number(match.matchCode.split("-")[0]) == selectedCourt
                  )
            ).value
        : [],
    [matches, matchType, departmentType, selectedCourt]
  );

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
          <Flex w="100%" justify="right">
            <CourtSelector
              courts={courts}
              court={selectedCourt}
              setCourt={setSelectedCourt}
            />
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
            <MatchHead matchType={matchType} />
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
        <Text>現在{config.match[matchType].name}試合はありません。</Text>
      )}
    </Stack>
  );
};

const MatchHead = ({ matchType }: { matchType: MatchType }) => (
  <Table.Thead>
    <Table.Tr>
      <Table.Th ta="center">試合番号</Table.Th>
      <Table.Th ta="center">コース番号</Table.Th>
      <Table.Th>{matchType == "pre" ? "左コース" : "チーム1"}</Table.Th>
      <Table.Th>{matchType == "pre" ? "右コース" : "チーム2"}</Table.Th>
      <Table.Th ta="center">状態</Table.Th>
    </Table.Tr>
  </Table.Thead>
);

const MatchColumn = ({ match }: { match: Match }) => {
  const matchStatus: StatusButtonProps["status"] = useMemo(() => {
    return getMatchStatus(match);
  }, [match]);

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
          <MatchStatusButton status={matchStatus} />
        </Center>
      </Table.Td>
    </Table.Tr>
  );
};
