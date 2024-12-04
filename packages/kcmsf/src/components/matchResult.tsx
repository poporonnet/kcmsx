import { Button, Flex, Paper, Text } from "@mantine/core";
import { IconArrowBack } from "@tabler/icons-react";
import { config, MatchInfo } from "config";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Match } from "../types/match";
import { parseSeconds } from "../utils/time";

type MatchResult = {
  teamID: string;
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
  const [rightTeamResult, setRightTeamResult] = useState<MatchResult>();
  const [leftTeamResult, setLeftTeamResult] = useState<MatchResult>();

  useEffect(() => {
    if (match?.runResults) {
      //TODO: 本選ではwinnerIDを用いる
      const team1ID =
        match.matchType === "pre" ? matchInfo.teams.right?.id : match.team1.id;
      const team2ID =
        match.matchType === "pre" ? matchInfo.teams.left?.id : match.team2.id;

      const team1Results = match.runResults.filter(
        (result) => result.teamID === team1ID
      );
      const team2Results = match.runResults.filter(
        (result) => result.teamID === team2ID
      );

      const team1Point = team1Results.reduce(
        (sum, result) => sum + result.points,
        0
      );
      const team2Point = team2Results.reduce(
        (sum, result) => sum + result.points,
        0
      );

      const team1GoalTime = team1Results.reduce((min, result) => {
        if (result.goalTimeSeconds !== null) {
          if (result.goalTimeSeconds < min) {
            return result.goalTimeSeconds;
          }
        }
        return min;
      }, Infinity);
      const team2GoalTime = team1Results.reduce((min, result) => {
        if (result.goalTimeSeconds !== null) {
          if (result.goalTimeSeconds < min) {
            return result.goalTimeSeconds;
          }
        }
        return min;
      }, Infinity);
      //結果を作成
      const team1Result = {
        teamID: team1ID!,
        points: team1Point,
        goalTimeSeconds: team1GoalTime,
      };
      const team2Result = {
        teamID: team2ID!,
        points: team2Point,
        goalTimeSeconds: team2GoalTime,
      };

      setRightTeamResult(team1Result);
      setLeftTeamResult(team2Result);
    }
  }, [match, matchInfo]);
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
            {leftTeamResult ? leftTeamResult.points : "結果無し"}
          </Text>
          <Text size="3rem">-</Text>
          <Text size="3rem" c="red" flex={1}>
            {rightTeamResult ? rightTeamResult.points : "結果無し"}
          </Text>
        </Flex>
      </Flex>
      <Text size="1.5rem">ゴールタイム</Text>
      <Flex align="center" justify="center" pb="sm" gap="lg">
        <Text size="2rem" c="blue" flex={1} style={{ whiteSpace: "nowrap" }}>
          {leftTeamResult && leftTeamResult?.goalTimeSeconds !== Infinity
            ? parseSeconds(leftTeamResult.goalTimeSeconds)
            : "finish"}
        </Text>
        <Text size="2rem" flex="none">
          -
        </Text>
        <Text size="2rem" c="red" flex={1} style={{ "white-space": "nowrap" }}>
          {rightTeamResult && rightTeamResult?.goalTimeSeconds !== Infinity
            ? parseSeconds(rightTeamResult.goalTimeSeconds)
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
