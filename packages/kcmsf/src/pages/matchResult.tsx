import { MatchType } from "config";
import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { RunResult } from "../types/runResult";

export const MatchResult = () => {
  const [rightTeamResult, setRightTeamResult] = useState<RunResult>();
  const [leftTeamResult, setLeftTeamResult] = useState<RunResult>();
  const { id, matchType } = useParams<{ id: string; matchType: MatchType }>();
  const featchMatchResult = useCallback(async () => {
    const res = await fetch(
      `${import.meta.env.VITE_API_URL}/match/${matchType}/${id}`,
      { method: "GET" }
    );
    if (!res.ok) return;
    const matchDatas = await res.json();
    console.log(matchDatas);
    const rightTeamID = matchDatas.leftTeam.id;
    const rightTeamResult = matchDatas.runResults.find(
      (result: RunResult) => result.teamID === rightTeamID
    );
    setRightTeamResult(rightTeamResult);
    console.log(rightTeamResult.points);
  }, []);
  useEffect(() => {
    featchMatchResult();
  }, [featchMatchResult]);
  return (
    <></>
    //   <Flex h="100%" direction="column" gap="md" align="center" justify="center">
    //     <Title order={1} m="1rem">
    //       試合結果
    //     </Title>
    //     <Paper w="100%" withBorder>
    //       <Flex align="center" justify="center">
    //         {leftTeamResult && (
    //           <Text pl="md" size="2rem" c="blue" style={{ flex: 1 }} mr="1rem">
    //             {leftTeamResult.teamName}
    //           </Text>
    //         )}
    //         <Flex pb="sm" gap="sm">
    //           <Text size="4rem" c="blue">
    //             {leftTeamResult.points}
    //           </Text>
    //           <Text size="4rem">-</Text>
    //           <Text size="4rem" c="red">
    //             {rightTeamResult.points}
    //           </Text>
    //         </Flex>
    //         {rightTeamResult && (
    //           <Text pr="md" size="2rem" c="red" style={{ flex: 1 }} ml="1rem">
    //             {rightTeamResult.teamName}
    //           </Text>
    //         )}
    //       </Flex>
    //       <Flex align="center" justify="center">
    //         <Flex pb="sm" gap="sm">
    //           <Text size="4rem" c="blue">
    //             {leftTeamResult.time}
    //           </Text>
    //           <Text size="4rem">-</Text>
    //           <Text size="4rem" c="red">
    //             {rightTeamResult.time}
    //           </Text>
    //         </Flex>
    //       </Flex>
    //     </Paper>
    //   </Flex>
  );
};
