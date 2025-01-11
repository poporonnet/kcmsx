import { Button, Divider, Flex, Stack, Text } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { IconArrowBack } from "@tabler/icons-react";
import { MatchInfo } from "config";
import { useCallback } from "react";
import { Link } from "react-router-dom";
import { useMatchResult } from "../hooks/useMatchResult";
import { PostMatchWinnerRequest } from "../types/api/match";
import { Match } from "../types/match";
import { parseSeconds } from "../utils/time";
import { MatchNameCard } from "./match/MatchNameCard";
import { MatchPointCard } from "./match/MatchPointCard";
import { WinnerSelector } from "./WinnerSelector";

export const MatchResult = ({
  match,
  matchInfo,
  onSelectWinner,
}: {
  match: Match;
  matchInfo: MatchInfo;
  onSelectWinner?: (isSucceeded: boolean) => Promise<void>;
}) => {
  const { team1Result, team2Result } = useMatchResult(match);
  const selectWinner = useCallback(
    async (winnerID: string) => {
      if (match.matchType !== "main") return;

      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/match/main/${match.id}/winner`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            winnerID: winnerID,
          } as PostMatchWinnerRequest),
        }
      ).catch(() => undefined);

      const isSucceeded = !!res?.ok;
      notifications.show({
        title: `勝利チーム決定${isSucceeded ? "成功" : "失敗"}`,
        message: `勝利チームの決定に${isSucceeded ? "成功" : "失敗"}しました`,
        color: isSucceeded ? "green" : "red",
      });
      await onSelectWinner?.(isSucceeded);
    },
    [match, onSelectWinner]
  );

  return (
    <Flex
      h="100%"
      miw="40rem"
      direction="column"
      gap="md"
      align="center"
      justify="center"
    >
      <MatchNameCard
        matchType={matchInfo.matchType}
        matchCode={match.matchCode}
        leftTeamName={
          match.matchType === "pre"
            ? match.leftTeam?.teamName
            : match.team1?.teamName
        }
        rightTeamName={
          match.matchType === "pre"
            ? match.rightTeam?.teamName
            : match.team2?.teamName
        }
      />
      <MatchPointCard
        leftTeamPoint={team1Result?.points ?? 0}
        rightTeamPoint={team2Result?.points ?? 0}
      />
      <Stack w="90%" my="md">
        <Text size="1.5rem">ベストタイム</Text>
        <Flex align="center" justify="center" pb="sm" gap="lg" w="100%">
          <Text size="2rem" c="blue" flex={1}>
            {team1Result &&
              (team1Result.goalTimeSeconds === Infinity
                ? "フィニッシュ"
                : parseSeconds(team1Result.goalTimeSeconds))}
          </Text>
          <Text size="2rem">-</Text>
          <Text size="2rem" c="red" flex={1}>
            {team2Result &&
              (team2Result.goalTimeSeconds === Infinity
                ? "フィニッシュ"
                : parseSeconds(team2Result.goalTimeSeconds))}
          </Text>
        </Flex>
      </Stack>
      {match.matchType === "main" && match.team1 && match.team2 && (
        <Stack w="90%" my="md">
          <Text size="1.5rem">勝利チーム</Text>
          {match.winnerID != "" ? (
            <Text
              size="3rem"
              c={match.team1?.id == match.winnerID ? "blue" : "red"}
            >
              {match.team1?.id == match.winnerID
                ? match.team1.teamName
                : match.team2?.teamName}
            </Text>
          ) : (
            <WinnerSelector
              team1={match.team1}
              team2={match.team2}
              onSelect={selectWinner}
            />
          )}
        </Stack>
      )}
      <Divider w="100%" my="xs" />
      <Button
        component={Link}
        to="/matchlist"
        leftSection={<IconArrowBack />}
        variant="outline"
      >
        試合表に戻る
      </Button>
    </Flex>
  );
};
