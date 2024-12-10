import {
  Button,
  Center,
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
import { useNavigate } from "react-router-dom";
import { CourtFilter, CourtSelector } from "../components/CourtSelector";
import { GenerateMatchButton } from "../components/GenerateMatchButton";
import { LabeledSegmentedControls } from "../components/LabeledSegmentedControls";
import {
  MatchStatusButton,
  StatusButtonProps,
} from "../components/matchStatus";
import { MatchSegmentedControl } from "../components/MatchTypeSegmentedControl";
import { useFetch } from "../hooks/useFetch";
import { useMatchTypeQuery } from "../hooks/useMatchTypeQuery";
import { GetMatchesResponse } from "../types/api/match";
import { Match } from "../types/match";
import { getMatchStatus } from "../utils/matchStatus";

export const MatchList = () => {
  const {
    data: matches,
    loading,
    error,
    refetch,
  } = useFetch<GetMatchesResponse>(`${import.meta.env.VITE_API_URL}/match`);
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

  const processedMatches = useMemo<Match[]>(
    () =>
      matches
        ? Cat.cat(matches)
            .feed((matches) => matches[matchType])
            .feed((matches) =>
              selectedCourt == "all"
                ? matches
                : matches.filter(
                    (match) =>
                      Number(match.matchCode.split("-")[0]) == selectedCourt
                  )
            ).value
        : [],
    [matches, matchType, selectedCourt]
  );

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

  return (
    <Stack justify="center" align="center" gap="md" w="fit-content">
      <Title m="1rem">試合表</Title>
      <LabeledSegmentedControls>
        <MatchSegmentedControl
          matchType={matchType}
          setMatchType={setMatchType}
        />
      </LabeledSegmentedControls>
      {!loading && matches && matches[matchType].length > 0 && (
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
          <Button mt={"2rem"} onClick={refetch}>
            <IconRefresh stroke={2} />
            再読み込み
          </Button>
        </>
      )}
      {matches?.[matchType].length === 0 && !loading && !error && (
        <>
          <Text>現在{config.match[matchType].name}試合はありません。</Text>
          <GenerateMatchButton
            generate={async () => {
              await Promise.all(
                config.departmentTypes.map((departmentType) =>
                  generateMatch(matchType, departmentType)
                )
              );
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

const MatchHead = ({ matchType }: { matchType: MatchType }) => (
  <Table.Thead>
    <Table.Tr>
      <Table.Th ta="center">試合番号</Table.Th>
      <Table.Th ta="center">コート番号</Table.Th>
      <Table.Th>{matchType == "pre" ? "左チーム" : "チーム1"}</Table.Th>
      <Table.Th>{matchType == "pre" ? "右チーム" : "チーム2"}</Table.Th>
      <Table.Th ta="center">状態</Table.Th>
    </Table.Tr>
  </Table.Thead>
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
    </Table.Tr>
  );
};
