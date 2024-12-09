import { Flex, Paper, Text } from "@mantine/core";
import { config, MatchInfo } from "config";
import { Match } from "../../types/match";

export const MatchNameCard = ({
  match,
  matchInfo,
}: {
  match: Match;
  matchInfo: MatchInfo;
}) => {
  return (
    <>
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
    </>
  );
};
