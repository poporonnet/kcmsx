import {
  Button,
  Divider,
  List,
  LoadingOverlay,
  Paper,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { useFetch } from "@mantine/hooks";
import { IconRefresh } from "@tabler/icons-react";
import { DepartmentType } from "config";
import { useMemo } from "react";
import { RankingRecord } from "../types/contest";
import { MainMatch } from "../types/match";
import { GenerateMatchButton } from "./GenerateMatchButton";

export const GenerateMainMatchCard = ({
  requiredTeamCount,
  selectedTeams,
  departmentType,
  generate,
}: {
  requiredTeamCount: number;
  selectedTeams: RankingRecord[];
  departmentType: DepartmentType;
  generate: (team1ID: string, team2ID: string) => Promise<void>;
}) => {
  const {
    data: mainMatches,
    error,
    loading,
    refetch,
  } = useFetch<MainMatch[]>(`${import.meta.env.VITE_API_URL}/match/main`);

  const remainingTeamCount = requiredTeamCount - selectedTeams.length;
  const processedMainMatch = useMemo(
    () =>
      mainMatches?.filter((match) => match.departmentType == departmentType),
    [mainMatches, departmentType]
  );

  const isGenerable = !loading && processedMainMatch?.length === 0 && !error;

  return (
    <Paper withBorder w="15rem" p="md" h="auto">
      <Stack gap="xs" h="100%">
        <Title order={4}>本戦試合生成</Title>
        <Divider />
        {isGenerable ? (
          <GenerableBody
            selectedTeams={selectedTeams}
            remainingTeamCount={remainingTeamCount}
            generate={generate}
          />
        ) : (
          <NotGenerableBody
            loading={loading}
            matches={processedMainMatch ?? undefined}
            isError={!!error && !processedMainMatch && !loading}
            refetch={refetch}
          />
        )}
      </Stack>
    </Paper>
  );
};

const NotGenerableBody = ({
  loading,
  matches,
  isError,
  refetch,
}: {
  loading: boolean;
  matches?: MainMatch[];
  isError?: boolean;
  refetch: () => void;
}) => (
  <Stack justify="center" flex={1} pos="relative" mih="10rem">
    <Text size="lg">本戦試合は現在生成できません。</Text>
    <LoadingOverlay
      visible={loading || (!matches && !isError)}
      zIndex={1000}
      overlayProps={{ radius: "sm", blur: 2 }}
    />
    {isError && <Text c="red">データフェッチに失敗しました。</Text>}
    {matches?.length === 0 && (
      <Text c="dark">本戦試合が既に存在しています。</Text>
    )}
    <Button leftSection={<IconRefresh />} onClick={refetch}>
      再読み込み
    </Button>
  </Stack>
);

const GenerableBody = ({
  selectedTeams,
  remainingTeamCount,
  generate,
}: {
  selectedTeams: RankingRecord[];
  remainingTeamCount: number;
  generate: (team1ID: string, team2ID: string) => Promise<void>;
}) => (
  <>
    現在選択しているチーム:
    <List withPadding flex={1} ta="left">
      {selectedTeams.map(({ teamID, teamName }) => (
        <List.Item key={teamID}>{teamName}</List.Item>
      ))}
    </List>
    {remainingTeamCount > 0 && (
      <Text c="red">
        本戦試合の生成にはあと{remainingTeamCount}
        チームの選択が必要です。
      </Text>
    )}
    <GenerateMatchButton
      generate={() =>
        generate(selectedTeams[0].teamID, selectedTeams[1].teamID)
      }
      disabled={remainingTeamCount > 0}
      modalTitle="本戦試合表生成確認"
      modalDetail={
        <>
          以下のチームによる本戦試合を生成します:
          <List withPadding>
            {selectedTeams.map(({ teamID, teamName }) => (
              <List.Item key={teamID}>{teamName}</List.Item>
            ))}
          </List>
        </>
      }
    />
  </>
);
