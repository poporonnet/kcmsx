import { Button, Flex, Text } from "@mantine/core";
import { IconArrowBack } from "@tabler/icons-react";
import { MatchInfo } from "config";
import { Link } from "react-router-dom";
import { useMatchResult } from "../hooks/useMatchResult";
import { Match } from "../types/match";
import { parseSeconds } from "../utils/time";
import { MatchHeader } from "./match/matchHeader";
import { MatchPointViewer } from "./match/matchPointViewer";

export const MatchResult = ({
  match,
  matchInfo,
}: {
  match: Match;
  matchInfo: MatchInfo;
}) => {
  console.log(match);
  const [team1Result, team2Result] = useMatchResult(match);
  return (
    <Flex
      h="100%"
      w="30rem"
      direction="column"
      gap="md"
      align="center"
      justify="center"
    >
      {matchInfo && <MatchHeader match={match!} matchInfo={matchInfo} />}
      <Text size="2rem">得点</Text>
      <MatchPointViewer
        isExhibition={false}
        matchInfo={matchInfo}
        points={{ left: team1Result.points, right: team2Result.points }}
      />
      <Text size="1.5rem">ゴールタイム</Text>
      <Flex align="center" justify="center" pb="sm" gap="lg">
        <Text size="2rem" c="blue" flex={1} style={{ whiteSpace: "nowrap" }}>
          {team1Result && team1Result?.goalTimeSeconds !== Infinity
            ? parseSeconds(team1Result.goalTimeSeconds)
            : "finish"}
        </Text>
        <Text size="2rem" flex="none">
          -
        </Text>
        <Text size="2rem" c="red" flex={1} style={{ whiteSpace: "nowrap" }}>
          {team2Result && team2Result?.goalTimeSeconds !== Infinity
            ? parseSeconds(team2Result.goalTimeSeconds)
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
