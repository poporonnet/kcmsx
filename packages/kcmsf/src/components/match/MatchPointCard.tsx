import { Flex, Text } from "@mantine/core";

export const MatchPointCard = ({
  rightTeamPoint,
  leftTeamPoint,
}: {
  rightTeamPoint: number;
  leftTeamPoint: number;
}) => (
  <Flex pb="sm" gap="sm">
    <Text size="4rem" c="blue">
      {leftTeamPoint}
    </Text>
    <Text size="4rem">-</Text>
    <Text size="4rem" c="red">
      {rightTeamPoint}
    </Text>
  </Flex>
);
