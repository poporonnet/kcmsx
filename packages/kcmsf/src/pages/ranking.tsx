import {
  Checkbox,
  Flex,
  Stack,
  Table,
  Text,
  Title,
  useMantineTheme,
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { config, DepartmentType, MatchType } from "config";
import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { DepartmentSegmentedControl } from "../components/DepartmentSegmentedControl";
import { GenerateMainMatchCard } from "../components/GenerateMainMatchCard";
import { MatchSegmentedControl } from "../components/MatchTypeSegmentedControl";
import { useFetch } from "../hooks/useFetch";
import { useInterval } from "../hooks/useInterval";
import { GetRankingResponse } from "../types/api/contest";
import { GeneratePreMatchManualRequest } from "../types/api/match";
import { RankingRecord } from "../types/contest";
import { parseSeconds } from "../utils/time";

export const Ranking = () => {
  const [matchType, setMatchType] = useState<MatchType>(config.matchTypes[0]);
  const [departmentType, setDepartmentType] = useState<DepartmentType>(
    config.departmentTypes[0]
  );
  const { data: ranking, refetch } = useFetch<GetRankingResponse>(
    `${import.meta.env.VITE_API_URL}/contest/${matchType}/${departmentType}/ranking`
  );
  const [selectedTeams, setSelectedTeams] = useState<
    Map<RankingRecord["teamID"], RankingRecord>
  >(new Map());
  const navigate = useNavigate();

  const [delay, setDelay] = useState(10000);
  const [isAutoReload, setIsAutoReload] = useState(false);

  const [fetchTime, setFetchTime] = useState<string>("00:00");

  const generateMainMatch = useCallback(
    async (team1ID: string, team2ID: string) => {
      const req: GeneratePreMatchManualRequest = {
        team1ID,
        team2ID,
      };

      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/match/main/${departmentType}/generate/manual`,
        {
          method: "POST",
          body: JSON.stringify(req),
          headers: {
            "Content-Type": "application/json",
          },
        }
      ).catch(() => undefined);

      const isSucceeded = !!res?.ok;

      notifications.show({
        title: `試合表生成${isSucceeded ? "成功" : "失敗"}`,
        message: `${config.department[departmentType].name}・${config.match.main.name}の試合表を生成${isSucceeded ? "しました" : "できませんでした"}`,
        color: isSucceeded ? "green" : "red",
      });

      if (isSucceeded) navigate("/matchlist?match_type=main");
    },
    [departmentType, navigate]
  );

  useEffect(() => {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, "0");
    const minutes = now.getMinutes().toString().padStart(2, "0");
    setFetchTime(`${hours}:${minutes}`);
  }, [ranking]);

  useEffect(() => {
    setDelay(isAutoReload ? 10000 : Infinity);
  }, [isAutoReload]);

  useInterval(refetch, delay);

  return (
    <Flex direction="column" align="center" justify="center" gap="md">
      <Title mt="md">ランキング</Title>
      <Stack gap={6} align="flex-end">
        <MatchSegmentedControl
          matchType={matchType}
          setMatchType={setMatchType}
        />
        <DepartmentSegmentedControl
          departmentType={departmentType}
          setDepartmentType={setDepartmentType}
        />
      </Stack>
      <Flex
        direction="row"
        align="stretch"
        justify="center"
        gap="md"
        h="fit-content"
      >
        <Stack>
          <Flex justify="space-between">
            <Text size="sm">更新時間 {fetchTime}</Text>
            <Checkbox
              defaultChecked
              label="自動更新"
              checked={isAutoReload}
              onChange={(e) => setIsAutoReload(e.currentTarget.checked)}
            />
          </Flex>
          <Table
            striped
            withTableBorder
            stickyHeader
            stickyHeaderOffset={60}
            horizontalSpacing="lg"
            highlightOnHover={matchType == "pre"}
            style={{ fontSize: "1rem" }}
            flex={1}
          >
            <Table.Thead>
              <Table.Tr>
                <Table.Th ta="center">順位</Table.Th>
                <Table.Th ta="center">チーム名</Table.Th>
                <Table.Th ta="center">合計得点</Table.Th>
                <Table.Th ta="center">ベストタイム</Table.Th>
                {matchType == "pre" && (
                  <Table.Th ta="center">本戦出場</Table.Th>
                )}
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {ranking?.map((record) => (
                <RankingColumn
                  record={record}
                  selectable={matchType == "pre"}
                  selected={selectedTeams.has(record.teamID)}
                  onSelect={() => {
                    if (selectedTeams.has(record.teamID))
                      selectedTeams.delete(record.teamID);
                    else if (selectedTeams.size < 2)
                      selectedTeams.set(record.teamID, record);
                    else return;

                    setSelectedTeams(new Map(selectedTeams));
                  }}
                  key={record.teamID}
                />
              ))}
            </Table.Tbody>
          </Table>
        </Stack>
        {matchType == "pre" && (
          <GenerateMainMatchCard
            requiredTeamCount={2}
            selectedTeams={[...selectedTeams.values()]}
            departmentType={departmentType}
            generate={generateMainMatch}
          />
        )}
      </Flex>
    </Flex>
  );
};

const RankingColumn = ({
  record,
  selectable,
  selected,
  onSelect,
}: {
  record: RankingRecord;
  selectable?: boolean;
  selected?: boolean;
  onSelect?: () => void;
}) => {
  const theme = useMantineTheme();

  return (
    <Table.Tr
      key={record.teamID}
      onClick={selectable ? onSelect : undefined}
      bg={selected ? theme.colors.blue[1] : undefined}
      style={{
        cursor: selectable ? "pointer" : "default",
      }}
    >
      <Table.Td>{record.rank}</Table.Td>
      <Table.Td ta="left">{record.teamName}</Table.Td>
      <Table.Td>{record.points}</Table.Td>
      <Table.Td>
        {record.goalTimeSeconds != null
          ? parseSeconds(record.goalTimeSeconds)
          : "-"}
      </Table.Td>
      {selectable && (
        <Table.Td>
          <Flex justify="center">
            <Checkbox checked={selected} readOnly />
          </Flex>
        </Table.Td>
      )}
    </Table.Tr>
  );
};
