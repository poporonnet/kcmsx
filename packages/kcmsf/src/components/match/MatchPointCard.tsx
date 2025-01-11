import { Flex, Paper, Text } from "@mantine/core";

export const MatchPointCard = ({
  rightTeamPoint,
  leftTeamPoint,
  leftSection,
  rightSection,
}: {
  rightTeamPoint: number;
  leftTeamPoint: number;
  leftSection?: React.ReactNode;
  rightSection?: React.ReactNode;
}) => (
  <Paper w="100%" withBorder>
    <Flex
      p="xs"
      gap="sm"
      direction="row"
      w="100%"
      justify="center"
      align="center"
    >
      {leftSection}
      <Flex gap="sm" direction="row" align="center" justify="center">
        <Text size="4rem" c="blue" ta="right">
          {leftTeamPoint}
        </Text>
        <Text size="4rem">-</Text>
        <Text size="4rem" c="red" ta="left">
          {rightTeamPoint}
        </Text>
      </Flex>
      {rightSection}
    </Flex>
  </Paper>
);
