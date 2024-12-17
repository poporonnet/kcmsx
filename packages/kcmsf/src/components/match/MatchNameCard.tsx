import { Flex, Paper, Text } from "@mantine/core";
import { MatchInfo } from "config";

export const MatchNameCard = ({
  matchType,
  matchCode,
  description,
  rightTeamName,
  leftTeamName,
}: {
  matchType: MatchInfo["matchType"];
  matchCode: string;
  description?: string;
  rightTeamName?: string;
  leftTeamName?: string;
}) => (
  <Paper w="100%" p="xs" withBorder>
    <Flex direction="row" align="center" justify="center">
      <Text size="2rem" c="blue" flex={1}>
        {leftTeamName}
      </Text>
      <Flex direction="column" align="center" justify="center" c="dark">
        {matchType === "main" ? "本選" : "予選"}
        {<Text size="2rem">#{matchCode}</Text>}
        {description}
      </Flex>
      <Text size="2rem" c="red" flex={1}>
        {rightTeamName}
      </Text>
    </Flex>
  </Paper>
);
