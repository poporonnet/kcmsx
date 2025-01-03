import { Button, Flex, Text } from "@mantine/core";
import { IconArrowBack } from "@tabler/icons-react";
import { MatchInfo } from "config";
import { Link } from "react-router-dom";
import { useMatchResult } from "../hooks/useMatchResult";
import { Match } from "../types/match";
import { parseSeconds } from "../utils/time";
import { MatchNameCard } from "./match/MatchNameCard";
import { MatchPointCard } from "./match/MatchPointCard";

export const MatchResult = ({
  match,
  matchInfo,
}: {
  match: Match;
  matchInfo: MatchInfo;
}) => {
  const { team1Result, team2Result } = useMatchResult(match);
  return (
    <Flex
      h="100%"
      w="30rem"
      direction="column"
      gap="md"
      align="center"
      justify="center"
    >
      <MatchNameCard
        matchType={matchInfo.matchType}
        matchCode={match.matchCode}
        rightTeamName={matchInfo.teams.right?.teamName}
        leftTeamName={matchInfo.teams.left?.teamName}
      />
      <Text size="2rem">得点</Text>
      <MatchPointCard
        leftTeamPoint={team1Result === undefined ? 0 : team1Result.points}
        rightTeamPoint={team2Result === undefined ? 0 : team2Result.points}
      />
      <Text size="1.5rem">ゴールタイム</Text>
      <Flex align="center" justify="center" pb="sm" gap="lg">
        <Text size="2rem" c="blue" flex={1} style={{ whiteSpace: "nowrap" }}>
          {team1Result === undefined
            ? "-"
            : team1Result.goalTimeSeconds === Infinity
              ? "フィニッシュ"
              : parseSeconds(team1Result.goalTimeSeconds)}
        </Text>
        <Text size="2rem" flex="none">
          -
        </Text>
        <Text size="2rem" c="red" flex={1} style={{ whiteSpace: "nowrap" }}>
          {team2Result === undefined
            ? "-"
            : team2Result.goalTimeSeconds === Infinity
              ? "フィニッシュ"
              : parseSeconds(team2Result.goalTimeSeconds)}
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
