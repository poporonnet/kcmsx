import { Flex, Paper, Text } from "@mantine/core";
import { config, MatchInfo } from "config";
import { ReactNode } from "react";

export const MatchNameCard = ({
  matchType,
  matchCode,
  rightTeamName,
  leftTeamName,
  centerSection,
  leftTeamCourseName,
  rightTeamCourseName,
}: {
  matchType: MatchInfo["matchType"];
  matchCode: string;
  rightTeamName?: string;
  leftTeamName?: string;
  centerSection?: ReactNode;
  leftTeamCourseName?: string;
  rightTeamCourseName?: string;
}) => (
  <Paper w="100%" p="xs" withBorder>
    <Flex direction="row" align="center" justify="center">
      <Flex direction="column" flex={1} gap="xs">
        <Text c="blue">{leftTeamCourseName}</Text>
        <Text size="2rem" c="blue">
          {leftTeamName}
        </Text>
      </Flex>
      <Flex direction="column" align="center" justify="center" c="dark">
        {config.match[matchType].name}
        {<Text size="2rem">#{matchCode}</Text>}
        {centerSection}
      </Flex>
      <Flex direction="column" flex={1} gap="xs">
        <Text c="red">{rightTeamCourseName}</Text>
        <Text size="2rem" c="red">
          {rightTeamName}
        </Text>
      </Flex>
    </Flex>
  </Paper>
);
