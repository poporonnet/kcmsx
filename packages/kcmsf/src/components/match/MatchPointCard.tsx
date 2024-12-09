import { Flex, Text } from "@mantine/core";
import { MatchInfo } from "config";

export const MatchPointViewer = ({
  IsExhibition,
  MatchInfo,
  RightTeamPoint,
  LeftTeamPoint,
}: {
  IsExhibition: boolean;
  MatchInfo?: MatchInfo;
  RightTeamPoint: number;
  LeftTeamPoint: number;
}) => {
  return (
    <Flex pb="sm" gap="sm">
      <Text size="4rem" c="blue">
        {IsExhibition || MatchInfo?.teams.left ? LeftTeamPoint : 0}
      </Text>
      <Text size="4rem">-</Text>
      <Text size="4rem" c="red">
        {IsExhibition || MatchInfo?.teams.right ? RightTeamPoint : 0}
      </Text>
    </Flex>
  );
};
