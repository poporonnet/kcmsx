import { Flex, Paper, Text } from "@mantine/core";
import { config, MatchInfo } from "config";

export const MatchNameCard = ({
  matchInfo,
  matchCode,
  description,
}: {
  matchInfo: MatchInfo;
  matchCode: string;
  description?: string;
}) => {
  return (
    <Paper w="100%" p="xs" withBorder>
      <Flex direction="row" align="center" justify="center">
        <Text size="2rem" c="blue" flex={1}>
          {matchInfo.teams.left?.teamName}
        </Text>
        <Flex direction="column" align="center" justify="center" c="dark">
          {config.match[matchInfo.matchType].name}
          {<Text size="2rem">#{matchCode}</Text>}
          {description}
        </Flex>
        <Text size="2rem" c="red" flex={1}>
          {matchInfo.teams.right?.teamName}
        </Text>
      </Flex>
    </Paper>
  );
};
