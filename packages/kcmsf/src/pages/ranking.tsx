import { DragDropContext, Draggable, Droppable } from "@hello-pangea/dnd";
import {
  Center,
  Checkbox,
  Flex,
  Stack,
  Table,
  Text,
  Title,
} from "@mantine/core";
import { useListState } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { IconGripVertical } from "@tabler/icons-react";
import { config } from "config";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { DepartmentSegmentedControl } from "../components/DepartmentSegmentedControl";
import { GenerateMainMatchCard } from "../components/GenerateMainMatchCard";
import { LabeledSegmentedControls } from "../components/LabeledSegmentedControls";
import { MatchSegmentedControl } from "../components/MatchTypeSegmentedControl";
import { useDepartmentTypeQuery } from "../hooks/useDepartmentTypeQuery";
import { useFetch } from "../hooks/useFetch";
import { useInterval } from "../hooks/useInterval";
import { useMatchTypeQuery } from "../hooks/useMatchTypeQuery";
import { GetRankingResponse } from "../types/api/contest";
import { GeneratePreMatchManualRequest } from "../types/api/match";
import { RankingRecord } from "../types/contest";
import { parseSeconds } from "../utils/time";

export const Ranking = () => {
  const [matchType, setMatchType] = useMatchTypeQuery(config.matchTypes[0]);
  const [departmentType, setDepartmentType] = useDepartmentTypeQuery(
    config.departmentTypes[0]
  );
  const { data: ranking, refetch } = useFetch<GetRankingResponse>(
    `${import.meta.env.VITE_API_URL}/contest/${matchType}/${departmentType}/ranking`
  );
  const [selectedTeams, setSelectedTeams] = useState<
    Map<RankingRecord["teamID"], RankingRecord>
  >(new Map());
  const [
    rankingOrder,
    { setState: setRankingOrder, reorder: reorderRankingOrder },
  ] = useListState<number>([]);

  const navigate = useNavigate();

  const [isAutoReload, setIsAutoReload] = useState(true);
  const [latestFetchTime, setLatestFetchTime] = useState<Date>();

  const requiredTeams = useMemo(() => {
    const requiredTeamsConfig = config.match.main.requiredTeams;
    const isKeyofRequiredTeams = (
      key: string
    ): key is keyof typeof requiredTeamsConfig => key in requiredTeamsConfig;

    return isKeyofRequiredTeams(departmentType)
      ? requiredTeamsConfig[departmentType]
      : undefined;
  }, [departmentType]);

  const generateMainMatch = useCallback(
    async (teamIDs: string[]) => {
      const req: GeneratePreMatchManualRequest = {
        teamIDs,
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

      if (isSucceeded)
        navigate(
          `/matchlist?match_type=main&department_type=${departmentType}`
        );
    },
    [departmentType, navigate]
  );

  useEffect(() => {
    const now = new Date();
    setLatestFetchTime(now);
    setRankingOrder([...new Array(ranking?.length ?? 0)].map((_, i) => i));
    setSelectedTeams(new Map());
  }, [ranking, setRankingOrder]);

  useInterval(refetch, 10000, { active: isAutoReload });

  return (
    <Stack w="fit-content" align="center" gap="md">
      <Title m="md">ランキング</Title>
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
      <Flex
        direction="row"
        align="stretch"
        justify="center"
        gap="md"
        h="fit-content"
      >
        <Stack>
          <Flex justify="space-between">
            <Text size="sm">
              最終更新
              {` ${latestFetchTime?.getHours().toString().padStart(2, "0")}:${latestFetchTime?.getMinutes().toString().padStart(2, "0")}`}
            </Text>
            <Checkbox
              label="自動更新"
              checked={isAutoReload}
              onChange={(e) => setIsAutoReload(e.currentTarget.checked)}
            />
          </Flex>
          <DragDropContext
            onDragEnd={({ destination, source }) => {
              reorderRankingOrder({
                from: source.index,
                to: destination?.index ?? source.index,
              });
            }}
          >
            {ranking && (
              <RankingTable
                ranking={ranking}
                rankingOrder={rankingOrder}
                selectable={matchType == "pre"}
                isSelected={(record) => selectedTeams.has(record.teamID)}
                onSelect={(record) => {
                  setIsAutoReload(false);

                  if (selectedTeams.has(record.teamID))
                    selectedTeams.delete(record.teamID);
                  else if (!requiredTeams || selectedTeams.size < requiredTeams)
                    selectedTeams.set(record.teamID, record);
                  else return;

                  setSelectedTeams(new Map(selectedTeams));
                }}
              />
            )}
          </DragDropContext>
        </Stack>
        {matchType == "pre" && (
          <GenerateMainMatchCard
            requiredTeamCount={requiredTeams}
            selectedTeams={
              ranking
                ? rankingOrder
                    .map((order) => ranking.at(order))
                    .filter(
                      (record): record is RankingRecord =>
                        !!record && selectedTeams.has(record.teamID)
                    )
                : []
            }
            departmentType={departmentType}
            generate={generateMainMatch}
          />
        )}
      </Flex>
    </Stack>
  );
};

const RankingTable = ({
  ranking,
  rankingOrder,
  selectable,
  isSelected,
  onSelect,
}: {
  ranking: RankingRecord[];
  rankingOrder: number[];
  selectable?: boolean;
  isSelected?: (record: RankingRecord) => boolean;
  onSelect?: (record: RankingRecord) => void;
}) => (
  <Table
    striped
    withTableBorder
    stickyHeader
    stickyHeaderOffset={60}
    horizontalSpacing="lg"
    highlightOnHover={selectable}
    style={{ fontSize: "1rem" }}
    flex={1}
  >
    <Table.Thead>
      <Table.Tr>
        <Table.Th ta="center">順位</Table.Th>
        <Table.Th ta="center">チーム名</Table.Th>
        <Table.Th ta="center">合計得点</Table.Th>
        <Table.Th ta="center">ベストタイム</Table.Th>
        {selectable && <Table.Th ta="center">本戦出場順</Table.Th>}
      </Table.Tr>
    </Table.Thead>
    <Droppable droppableId="ranking" direction="vertical">
      {(provided) => (
        <Table.Tbody {...provided.droppableProps} ref={provided.innerRef}>
          <RankingRows
            {...{ ranking, rankingOrder, selectable, isSelected, onSelect }}
          />
          {provided.placeholder}
        </Table.Tbody>
      )}
    </Droppable>
  </Table>
);

const RankingRows = ({
  ranking,
  rankingOrder,
  selectable,
  isSelected,
  onSelect,
}: {
  ranking: RankingRecord[];
  rankingOrder: number[];
  selectable?: boolean;
  isSelected?: (record: RankingRecord) => boolean;
  onSelect?: (record: RankingRecord) => void;
}) => {
  const selectionIndexMap = useMemo(
    () =>
      new Map(
        rankingOrder
          .map((order, index) => [ranking.at(order), index] as const)
          .filter(([record]) => record && isSelected?.(record))
          .map(([, index], selectionIndex) => [index, selectionIndex] as const)
      ),
    [ranking, rankingOrder, isSelected]
  );

  return rankingOrder.map((order, index) => {
    const record = ranking.at(order);
    return (
      record && (
        <RankingRow
          index={index}
          record={record}
          selectable={selectable}
          selectionIndex={selectionIndexMap.get(index)}
          selected={isSelected?.(record)}
          onSelect={() => onSelect?.(record)}
          key={record.teamID}
        />
      )
    );
  });
};

const RankingRow = ({
  index,
  record,
  selectable,
  selectionIndex,
  selected,
  onSelect,
}: {
  index: number;
  record: RankingRecord;
  selectable?: boolean;
  selectionIndex?: number;
  selected?: boolean;
  onSelect?: () => void;
}) => (
  <Draggable
    draggableId={`draggable-${record.teamID}`}
    index={index}
    isDragDisabled={!selected}
  >
    {(provided) => (
      <Table.Tr
        onClick={selectable ? onSelect : undefined}
        bg={selected ? "blue.1" : undefined}
        h="fit-content"
        style={{
          cursor: selectable ? "pointer" : "default",
        }}
        ref={provided.innerRef}
        {...provided.draggableProps}
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
          <>
            <Table.Td>
              <Flex justify="center" align="center" gap="xs">
                <Checkbox
                  checked={selected}
                  readOnly
                  {...(selectionIndex != null && {
                    icon: (props) => (
                      <Center {...props}>{selectionIndex + 1}</Center>
                    ),
                  })}
                />
              </Flex>
            </Table.Td>
            <Table.Td w="fit-content" p={0} pr="xs">
              <Center
                {...provided.dragHandleProps}
                c={selected ? "dark" : "gray"}
                style={{ fontSizeAdjust: "ch-width" }}
              >
                <IconGripVertical />
              </Center>
            </Table.Td>
          </>
        )}
      </Table.Tr>
    )}
  </Draggable>
);
