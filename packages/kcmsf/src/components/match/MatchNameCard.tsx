import { Flex, Paper, Text } from "@mantine/core";
import { config, MatchInfo } from "config";
import { ReactNode } from "react";

export const MatchNameCard = ({
  matchType,
  matchCode,
  rightTeamName,
  leftTeamName,
  centerSection,
  side,
}: {
  matchType: MatchInfo["matchType"];
  matchCode: string;
  rightTeamName?: string;
  leftTeamName?: string;
  centerSection?: ReactNode;
  side?: string[];
}) => (
  <Paper w="100%" p="xs" withBorder>
    <Flex direction="row" align="center" justify="center">
      <Flex direction="column" flex={1}>
        <Text size="1rem" c="blue" mb="xs">
          {side && side[0]}
        </Text>
        <Text size="2rem" c="blue">
          {leftTeamName}
        </Text>
      </Flex>
      <Flex direction="column" align="center" justify="center" c="dark">
        {config.match[matchType].name}
        {<Text size="2rem">#{matchCode}</Text>}
        {centerSection}
      </Flex>
      <Flex direction="column" flex={1}>
        <Text size="1rem" c="red" mb="xs">
          {side && side[1]}
        </Text>
        <Text size="2rem" c="red">
          {rightTeamName}
        </Text>
      </Flex>
    </Flex>
  </Paper>
);
