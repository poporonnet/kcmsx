import {
  Flex,
  SegmentedControl,
  Table,
  Text,
  Title,
  useMantineTheme,
} from "@mantine/core";
import { config, DepartmentType, MatchType } from "config";
import { useCallback, useEffect, useState } from "react";
import { useInterval } from "../hooks/useInterval";
import { GetRankingResponse } from "../types/api/contest";
import { RankingRecord } from "../types/contest";
import { parseSeconds } from "../utils/time";

export const Ranking = () => {
  const [matchType, setMatchType] = useState<MatchType>(config.matchTypes[0]);
  const [departmentType, setDepartmentType] = useState<DepartmentType>(
    config.departmentTypes[0]
  );
  const [ranking, setRanking] = useState<RankingRecord[]>();

  const getRanking = useCallback(async () => {
    const res = await fetch(
      `${import.meta.env.VITE_API_URL}/contest/${matchType}/${departmentType}/ranking`
    ).catch(() => undefined);
    if (!res?.ok) {
      setRanking(undefined);
      return;
    }

    const rankingData = (await res.json()) as GetRankingResponse;
    setRanking(rankingData);
  }, [matchType, departmentType]);

  useEffect(() => {
    getRanking();
  }, [getRanking]);

  useInterval(getRanking, 10000); // 10秒ごとにランキングを更新

  return (
    <Flex direction="column" align="center" justify="center" gap="md">
      <Title mt="md">ランキング</Title>
      <Control
        matchType={matchType}
        departmentType={departmentType}
        setMatchType={setMatchType}
        setDepartmentType={setDepartmentType}
      />
      <Table
        striped
        withTableBorder
        stickyHeader
        stickyHeaderOffset={60}
        horizontalSpacing="lg"
        style={{ fontSize: "1rem" }}
      >
        <Table.Thead>
          <Table.Tr>
            <Table.Th style={{ textAlign: "center" }}>順位</Table.Th>
            <Table.Th style={{ textAlign: "center" }}>チーム名</Table.Th>
            <Table.Th style={{ textAlign: "center" }}>合計得点</Table.Th>
            <Table.Th style={{ textAlign: "center" }}>ゴールタイム</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {ranking?.map((record) => (
            <Table.Tr key={record.teamID}>
              <Table.Td>{record.rank}</Table.Td>
              <Table.Td style={{ textAlign: "start" }}>
                {record.teamName}
              </Table.Td>
              <Table.Td>{record.points}</Table.Td>
              <Table.Td>
                {record.goalTimeSeconds
                  ? parseSeconds(record.goalTimeSeconds)
                  : "-"}
              </Table.Td>
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>
    </Flex>
  );
};

const Control = ({
  matchType,
  departmentType,
  setMatchType,
  setDepartmentType,
}: {
  matchType: MatchType;
  departmentType: DepartmentType;
  setMatchType: (matchType: MatchType) => void;
  setDepartmentType: (departmentType: DepartmentType) => void;
}) => {
  const theme = useMantineTheme();

  return (
    <Table verticalSpacing={3} withRowBorders={false} w="fit-content">
      <Table.Tbody>
        <Table.Tr>
          <Table.Td>
            <Text c={theme.colors.dark[4]} ta="right">
              試合の種別:
            </Text>
          </Table.Td>
          <Table.Td>
            <SegmentedControl
              data={config.matches.map((match) => ({
                label: match.name,
                value: match.type,
              }))}
              value={matchType}
              onChange={(value) => setMatchType(value as MatchType)}
              fullWidth
            />
          </Table.Td>
        </Table.Tr>
        <Table.Tr>
          <Table.Td>
            <Text c={theme.colors.dark[4]} ta="right">
              部門:
            </Text>
          </Table.Td>
          <Table.Td>
            <SegmentedControl
              data={config.departments.map((department) => ({
                label: department.name,
                value: department.type,
              }))}
              value={departmentType}
              onChange={(value) => setDepartmentType(value as DepartmentType)}
              fullWidth
            />
          </Table.Td>
        </Table.Tr>
      </Table.Tbody>
    </Table>
  );
};
