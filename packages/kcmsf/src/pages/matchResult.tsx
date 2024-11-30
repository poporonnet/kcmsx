import { Button, Flex, Text, Title } from "@mantine/core";
import { config, MatchType } from "config";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useMatchInfo } from "../hooks/useMatchInfo";
import { RunResult } from "../types/runResult";
import { parseSeconds } from "../utils/time";

export const MatchResult = () => {
  const [rightTeamResult, setRightTeamResult] = useState<RunResult>();
  const [leftTeamResult, setLeftTeamResult] = useState<RunResult>();
  const { id, matchType } = useParams<{ id: string; matchType: MatchType }>();
  const { match, matchInfo } = useMatchInfo(id, matchType);

  useEffect(() => {
    if (match?.runResults) {
      if (match.matchType == "pre") {
        if (match.runResults[0].teamID == matchInfo?.teams.right?.id) {
          setRightTeamResult(match.runResults[0]);
          setLeftTeamResult(match.runResults[1]);
        } else {
          setRightTeamResult(match.runResults[1]);
          setLeftTeamResult(match.runResults[0]);
        }
      } else {
        const team1ID = match.team1.id;
        const team2ID = match.team2.id;

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
        //　ゴール宣言した結果のみを抽出
        const tema1GoalStateData = team1Results.filter((result) => {
          return result.finishState === "goal";
        });
        const tema2GoalStateData = team2Results.filter((result) => {
          return result.finishState === "goal";
        });
        // ゴール宣言した結果の中で最も早いゴールタイムを取得,0件の場合はnull
        const team1GoalTime =
          tema1GoalStateData.length === 0
            ? null
            : Math.min(
                ...tema1GoalStateData.map((result) => result.goalTimeSeconds)
              );
        const team2GoalTime =
          tema2GoalStateData.length === 0
            ? null
            : Math.min(
                ...tema2GoalStateData.map((result) => result.goalTimeSeconds)
              );
        //　結果を作成
        const team1Result = {
          teamID: team1ID,
          points: team1Point,
          goalTimeSeconds: team1GoalTime,
        } as RunResult;
        const team2Result = {
          teamID: team1ID,
          points: team2Point,
          goalTimeSeconds: team2GoalTime,
        } as RunResult;

        setRightTeamResult(team1Result);
        setLeftTeamResult(team2Result);
      }
    }
  }, [match, matchInfo]);
  return (
    <Flex
      h="100%"
      direction="column"
      gap="md"
      align="center"
      justify="center"
      mx="2rem"
    >
      {matchInfo && (
        <Flex align="center" direction="column" justify="center" gap="sm">
          <Title order={1}>{config.contestName}</Title>
          <Title order={2}>
            {config.match[matchInfo?.matchType].name} #{match?.matchCode}{" "}
            試合結果
          </Title>
        </Flex>
      )}
      <Flex align="center" justify="center">
        <Flex pb="sm" gap="lg">
          <Text size="2.5rem" c="blue">
            {matchInfo?.teams.left?.teamName}
          </Text>
          <Text size="2.5rem">vs</Text>
          <Text size="2.5rem" c="red">
            {matchInfo?.teams.right?.teamName}
          </Text>
        </Flex>
      </Flex>
      <Text size="2.5rem">得点</Text>
      <Flex align="center" justify="center">
        <Flex pb="sm" gap="lg">
          <Text size="3rem" c="blue">
            {leftTeamResult ? leftTeamResult.points + "点" : "結果無し"}
          </Text>
          <Text size="3rem">-</Text>
          <Text size="3rem" c="red">
            {rightTeamResult ? rightTeamResult.points + "点" : "結果無し"}
          </Text>
        </Flex>
      </Flex>
      <Text size="2.5rem">ゴールタイム</Text>
      <Flex align="center" justify="center">
        <Flex pb="sm" gap="lg">
          <Text size="3rem" c="blue">
            {leftTeamResult && leftTeamResult?.goalTimeSeconds !== null
              ? parseSeconds(leftTeamResult.goalTimeSeconds)
              : "フィニッシュ"}
          </Text>
          <Text size="3rem">-</Text>
          <Text size="3rem" c="red">
            {rightTeamResult && rightTeamResult?.goalTimeSeconds !== null
              ? parseSeconds(rightTeamResult.goalTimeSeconds)
              : "フィニッシュ"}
          </Text>
        </Flex>
      </Flex>
      <Flex mt="1rem">
        <Button mx="3rem" flex={1}>
          <Link to={"/matchlist"} style={{ color: "white" }}>
            <Text>試合表に戻る</Text>
          </Link>
        </Button>
      </Flex>
    </Flex>
  );
};
