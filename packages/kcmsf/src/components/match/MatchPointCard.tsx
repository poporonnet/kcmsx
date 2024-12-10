import { Flex, Text } from "@mantine/core";

export const MatchPointViewer = ({
  RightTeamPoint,
  LeftTeamPoint,
}: {
  RightTeamPoint: number;
  LeftTeamPoint: number;
}) => {
  return (
    <Flex pb="sm" gap="sm">
      <Text size="4rem" c="blue">
        {LeftTeamPoint}
      </Text>
      <Text size="4rem">-</Text>
      <Text size="4rem" c="red">
        {RightTeamPoint}
      </Text>
    </Flex>
  );
};
