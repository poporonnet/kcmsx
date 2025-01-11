import { Button, Divider, Flex, Space, Text } from "@mantine/core";
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
      miw="40rem"
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
      <MatchPointCard
        leftTeamPoint={team1Result?.points ?? 0}
        rightTeamPoint={team2Result?.points ?? 0}
      />
      <Space />
      <Text size="1.5rem">ベストタイム</Text>
      <Flex align="center" justify="center" pb="sm" gap="lg" w="90%">
        <Text size="2rem" c="blue" flex={1}>
          {team1Result === undefined
            ? ""
            : team1Result.goalTimeSeconds === Infinity
              ? "フィニッシュ"
              : parseSeconds(team1Result.goalTimeSeconds)}
        </Text>
        <Text size="2rem">-</Text>
        <Text size="2rem" c="red" flex={1}>
          {team2Result === undefined
            ? ""
            : team2Result.goalTimeSeconds === Infinity
              ? "フィニッシュ"
              : parseSeconds(team2Result.goalTimeSeconds)}
        </Text>
      </Flex>
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
