import { Button, Flex, Paper, Text } from "@mantine/core";
import { IconArrowBack } from "@tabler/icons-react";
import { config, MatchInfo } from "config";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Match } from "../types/match";
import { parseSeconds } from "../utils/time";
import { useMatchResult } from "../hooks/useMatchResult";

type MatchResult = {
  teamID: string | undefined;
  points: number;
  goalTimeSeconds: number;
};
export const MatchResult = ({
  match,
  matchInfo,
}: {
  match: Match;
  matchInfo: MatchInfo;
}) => {
  //本選の場合は右が勝利チーム，左が敗北チーム
  const [team1Result, setTeam1Result] = useState<MatchResult>();
  const [team2Result, setTeam2Result] = useState<MatchResult>();

  useEffect(() => {
    if (match?.runResults) {
      const [team1Result, team2Result] = useMatchResult(match);
      setTeam1Result(team1Result);
      setTeam2Result(team2Result);
    }
  }, [match]);
  return (
    <Flex
      h="100%"
      w="30rem"
      direction="column"
      gap="md"
      align="center"
      justify="center"
    >
      {matchInfo && (
        <Paper p="xs" w="100%" withBorder>
          <Flex direction="row" align="center" justify="center">
            <Text
              size="1.5rem"
              c="blue"
              flex={1}
              style={{ whiteSpace: "nowrap" }}
            >
              {matchInfo?.teams.left?.teamName}
            </Text>
            <Flex direction="column" align="center" justify="center" c="dark">
              {config.match[matchInfo?.matchType].name}
              <Text size="2rem">#{match?.matchCode}</Text>
            </Flex>
            <Text
              size="1.5rem"
              c="red"
              flex={1}
              style={{ whiteSpace: "nowrap" }}
            >
              {matchInfo?.teams.right?.teamName}
            </Text>
          </Flex>
        </Paper>
      )}

      <Text size="2rem">得点</Text>
      <Flex align="center" justify="center">
        <Flex pb="sm" gap="lg">
          <Text size="3rem" c="blue" flex={1}>
            {team2Result ? team2Result.points : "結果無し"}
          </Text>
          <Text size="3rem">-</Text>
          <Text size="3rem" c="red" flex={1}>
            {team1Result ? team1Result.points : "結果無し"}
          </Text>
        </Flex>
      </Flex>
      <Text size="1.5rem">ゴールタイム</Text>
      <Flex align="center" justify="center" pb="sm" gap="lg">
        <Text size="2rem" c="blue" flex={1} style={{ whiteSpace: "nowrap" }}>
          {team2Result && team2Result?.goalTimeSeconds !== Infinity
            ? parseSeconds(team2Result.goalTimeSeconds)
            : "finish"}
        </Text>
        <Text size="2rem" flex="none">
          -
        </Text>
        <Text size="2rem" c="red" flex={1} style={{ "white-space": "nowrap" }}>
          {team1Result && team1Result?.goalTimeSeconds !== Infinity
            ? parseSeconds(team1Result.goalTimeSeconds)
            : "finish"}
        </Text>
      </Flex>
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
