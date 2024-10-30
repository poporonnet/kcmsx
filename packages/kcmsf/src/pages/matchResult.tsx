import { Flex, Paper, Text, Title } from "@mantine/core";
import { config, MatchType } from "config";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useMatchInfo } from "../hooks/useMatchInfo";
import { RunResult } from "../types/runResult";

export const MatchResult = () => {
  const [rightTeamResult, setRightTeamResult] = useState<RunResult>();
  const [leftTeamResult, setLeftTeamResult] = useState<RunResult>();
  const { id, matchType } = useParams<{ id: string; matchType: MatchType }>();
  const { match, matchInfo } = useMatchInfo(id, matchType);
  console.log(match?.runResults);
  useEffect(() => {
    if (match?.runResults) {
      setRightTeamResult(match.runResults[0]);
      setLeftTeamResult(match.runResults[1]);
    }
  }, [match]);
  return (
    <Flex h="100%" direction="column" gap="md" align="center" justify="center">
      <Title order={1}>試合結果</Title>
      {matchInfo && (
        <Paper w="100%" p="xs" withBorder>
          <Flex direction="row" align="center" justify="center">
            <Text size="2rem" c="blue" flex={1}>
              {matchInfo?.teams.left?.teamName}
            </Text>
            <Flex direction="column" align="center" justify="center" c="dark">
              {config.match[matchInfo?.matchType].name}
              <Text size="2rem">#{match?.matchCode}</Text>
              {match?.matchType == "main" &&
                `${match.runResults.length == 0 ? 1 : 2}試合目`}
            </Flex>
            <Text size="2rem" c="red" flex={1}>
              {matchInfo?.teams.right?.teamName}
            </Text>
          </Flex>
        </Paper>
      )}
      <Paper w="100%" withBorder>
        <Flex align="center" justify="center">
          <Flex pb="sm" gap="sm">
            <Text size="4rem" c="blue" flex={10}>
              {rightTeamResult ? rightTeamResult.points + "点" : "結果無し"}
            </Text>
            <Text size="4rem" flex={1}>
              -
            </Text>
            <Text size="4rem" c="red" flex={10}>
              {leftTeamResult ? leftTeamResult.points + "点" : "結果無し"}
            </Text>
          </Flex>
        </Flex>
        <Flex align="center" justify="center">
          <Flex pb="sm" gap="sm">
            <Text size="4rem" c="blue" flex={10}>
              {rightTeamResult && rightTeamResult?.goalTimeSeconds !== null
                ? rightTeamResult.goalTimeSeconds + "秒"
                : "フィニッシュ"}
            </Text>
            <Text size="4rem" flex={1}>
              -
            </Text>
            <Text size="4rem" c="red" flex={10}>
              {leftTeamResult && leftTeamResult?.goalTimeSeconds !== null
                ? leftTeamResult.goalTimeSeconds + "秒"
                : "フィニッシュ"}
            </Text>
          </Flex>
        </Flex>
      </Paper>
    </Flex>
  );
};
