import { Button, Flex, Table, Text, Title } from "@mantine/core";
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
      if (matchInfo?.matchType == "pre") {
        if (match.runResults[0].teamID == matchInfo?.teams.right?.id) {
          setRightTeamResult(match.runResults[0]);
          setLeftTeamResult(match.runResults[1]);
        } else {
          setRightTeamResult(match.runResults[1]);
          setLeftTeamResult(match.runResults[0]);
        }
      } else if (matchInfo?.matchType == "main") {
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

        const team1GoalTime = team1Results
          .map((result) => result.goalTimeSeconds)
          .sort()[1];
        const team2GoalTime = team2Results
          .map((result) => result.goalTimeSeconds)
          .sort()[1];

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
  }, [match,matchInfo]);
  return (
    <Flex
      h="100%"
      direction="column"
      gap="md"
      align="center"
      justify="center"
      mx="2rem"
    >
      <Title order={1}>試合結果</Title>
      {matchInfo && (
        <Flex direction="row" align="center" justify="center">
          <Text size="2rem" mx="1rem">
            {config.match[matchInfo?.matchType].name}
          </Text>
          <Text size="2rem">#{match?.matchCode}</Text>
        </Flex>
      )}
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
            <Table.Th>
              <Text size="1.5rem" c="gray.8" ta="center">
                チーム名
              </Text>
            </Table.Th>
            <Table.Th>
              <Text size="1.5rem" c="dark.7" ta="center">
                {matchInfo?.teams.left?.teamName}
              </Text>
            </Table.Th>
            <Table.Th>
              <Text size="1.5rem" c="dark.7" ta="center">
                {matchInfo?.teams.right?.teamName}
              </Text>
            </Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          <Table.Tr>
            <Table.Td>
              <Text size="1.5rem" c="gray.7" ta="center">
                得点
              </Text>
            </Table.Td>
            <Table.Td>
              <Text size="3rem" c="dark.4">
                {leftTeamResult ? leftTeamResult.points + "点" : "結果無し"}
              </Text>
            </Table.Td>
            <Table.Td>
              <Text size="3rem" c="dark.4">
                {rightTeamResult ? rightTeamResult.points + "点" : "結果無し"}
              </Text>
            </Table.Td>
          </Table.Tr>
          <Table.Tr>
            <Table.Td>
              <Text size="1.5rem" c="gray.7" ta="center">
                タイム
              </Text>
            </Table.Td>
            <Table.Td>
              {leftTeamResult && leftTeamResult?.goalTimeSeconds !== null ? (
                <Text size="3rem" c="dark.4">
                  {parseSeconds(leftTeamResult.goalTimeSeconds)}
                </Text>
              ) : (
                <Text size="3rem" c="dark.4">
                  -
                </Text>
              )}
            </Table.Td>
            <Table.Td>
              {rightTeamResult && rightTeamResult?.goalTimeSeconds !== null ? (
                <Text size="3rem" c="dark.4">
                  {parseSeconds(rightTeamResult.goalTimeSeconds)}
                </Text>
              ) : (
                <Text size="3rem" c="dark.4">
                  -
                </Text>
              )}
            </Table.Td>
          </Table.Tr>
        </Table.Tbody>
      </Table>
      <Flex mt="1rem">
        <Button mx="3rem" flex={1}>
          <Link to={"/matchlist"} style={{ color: "white" }}>
            <Text>試合表へ戻る</Text>
          </Link>
        </Button>
      </Flex>
    </Flex>
  );
};

// <Flex align="center" justify="center">
//           <Flex pb="sm" gap="sm">
//             <Text size="4rem" c="blue" style={{ whiteSpace: "nowrap" }}>
//               {leftTeamResult ? leftTeamResult.points + "点" : "結果無し"}
//             </Text>
//             <Text size="4rem" style={{ whiteSpace: "nowrap" }}>
//               -
//             </Text>
//             <Text size="4rem" c="red" style={{ whiteSpace: "nowrap" }}>
//               {rightTeamResult ? rightTeamResult.points + "点" : "結果無し"}
//             </Text>
//           </Flex>
//         </Flex>
//         <Flex align="center" justify="center">
//           <Flex pb="sm" gap="sm">
//             <Text size="4rem" c="blue" style={{ whiteSpace: "nowrap" }}>
//               {leftTeamResult && leftTeamResult?.goalTimeSeconds !== null
//                 ? leftTeamResult.goalTimeSeconds + "秒"
//                 : "フィニッシュ"}
//             </Text>
//             <Text size="4rem">-</Text>
//             <Text size="4rem" c="red" style={{ whiteSpace: "nowrap" }}>
//               {rightTeamResult && rightTeamResult?.goalTimeSeconds !== null
//                 ? rightTeamResult.goalTimeSeconds + "秒"
//                 : "フィニッシュ"}
//             </Text>
//           </Flex>
//         </Flex>
//         <Flex>
//           <Button mx="3rem" flex={1}>
//             <Link to={"/matchlist"} style={{ color: "white" }}>
//               <Text>試合表へ戻る</Text>
//             </Link>
//           </Button>
//           <Button mx="3rem" flex={1}>
//             <Link to={"/ranking"} style={{ color: "white" }}>
//               <Text>ランキングへ</Text>
//             </Link>
//           </Button>
//         </Flex>
