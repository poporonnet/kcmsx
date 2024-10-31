import { Button, Flex, Paper, Text, Title } from "@mantine/core";
import { config, MatchType } from "config";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useMatchInfo } from "../hooks/useMatchInfo";
import { RunResult } from "../types/runResult";

export const MatchResult = () => {
  const [rightTeamResult, setRightTeamResult] = useState<RunResult>();
  const [leftTeamResult, setLeftTeamResult] = useState<RunResult>();
  const { id, matchType } = useParams<{ id: string; matchType: MatchType }>();
  const { match, matchInfo } = useMatchInfo(id, matchType);
  //console.log(match);
  //console.log(matchInfo);
  useEffect(() => {
    if (match?.runResults) {
      if (matchInfo?.matchType == "pre") {
        if (match.runResults[0].teamID == matchInfo?.teams.right?.id) {
          setRightTeamResult(match.runResults[0]);
          setLeftTeamResult(match.runResults[1]);
        } else {
          setRightTeamResult(match.runResults[1]);
          setLeftTeamResult(match.runResults[0]);
        }
      } else {
        //Todo:本選の場合は合計を出す
        //loopとかを使って合計を計算する?
        // console.log(match.runResults);
        // console.log(matchInfo?.teams.right?.id);
        // const rightTeamResultPoints=match.runResults
        //   .filter((result) => {
        //     result.teamID == matchInfo?.teams.right?.id;
        //   })
        //   .reduce((sum, result) => sum + result.points,0);
        // console.log(rightTeamResultPoints);
        
        if (match.runResults[0].teamID == matchInfo?.teams.right?.id) {
          setRightTeamResult(match.runResults[0]);
          setLeftTeamResult(match.runResults[1]);
        } else {
          setRightTeamResult(match.runResults[1]);
          setLeftTeamResult(match.runResults[0]);
        }
      }
    }
  }, [match]);
  return (
    <Flex h="100%" direction="column" gap="md" align="center" justify="center">
      <Title order={1}>試合結果</Title>
      {matchInfo && (
        <Paper w="100%" p="xs" withBorder>
          <Flex direction="row" align="center" justify="center">
            <Text
              size="2rem"
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
            <Text size="2rem" c="red" flex={1} style={{ whiteSpace: "nowrap" }}>
              {matchInfo?.teams.right?.teamName}
            </Text>
          </Flex>
        </Paper>
      )}
      <Paper w="100%" withBorder>
        <Flex align="center" justify="center">
          <Flex pb="sm" gap="sm">
            <Text size="4rem" c="blue" style={{ whiteSpace: "nowrap" }}>
              {leftTeamResult ? leftTeamResult.points + "点" : "結果無し"}
            </Text>
            <Text size="4rem" style={{ whiteSpace: "nowrap" }}>
              -
            </Text>
            <Text size="4rem" c="red" style={{ whiteSpace: "nowrap" }}>
              {rightTeamResult ? rightTeamResult.points + "点" : "結果無し"}
            </Text>
          </Flex>
        </Flex>
        <Flex align="center" justify="center">
          <Flex pb="sm" gap="sm">
            <Text size="3rem" c="blue">
              {leftTeamResult && leftTeamResult?.goalTimeSeconds !== null
                ? leftTeamResult.goalTimeSeconds + "秒"
                : "フィニッシュ"}
            </Text>
            <Text size="3rem">-</Text>
            <Text size="3rem" c="red" style={{ whiteSpace: "nowrap" }}>
              {rightTeamResult && rightTeamResult?.goalTimeSeconds !== null
                ? rightTeamResult.goalTimeSeconds + "秒"
                : "フィニッシュ"}
            </Text>
          </Flex>
        </Flex>
      </Paper>
      <Flex>
        <Button mx="3rem" flex={1}>
          <Link to={"/matchlist"} style={{ color: "white" }}>
            <Text>試合表へ戻る</Text>
          </Link>
        </Button>
        <Button mx="3rem" flex={1}>
          <Link to={"/ranking"} style={{ color: "white" }}>
            <Text>ランキングへ</Text>
          </Link>
        </Button>
      </Flex>
    </Flex>
  );
};
