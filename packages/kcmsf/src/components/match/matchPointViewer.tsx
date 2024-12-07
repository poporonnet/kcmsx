import { Flex, Text } from "@mantine/core";
import { MatchInfo } from "config";

type point = {
  right: number;
  left: number;
};
export const MatchPointViewer = ({
  isExhibition,
  matchInfo,
  points,
}: {
  isExhibition: boolean;
  matchInfo?: MatchInfo;
  points: point;
}) => {
  return (
    <Flex pb="sm" gap="sm">
      <Text size="4rem" c="blue">
        {isExhibition || matchInfo?.teams.left ? points.left : 0}
      </Text>
      <Text size="4rem">-</Text>
      <Text size="4rem" c="red">
        {isExhibition || matchInfo?.teams.right ? points.right : 0}
      </Text>
    </Flex>
  );
};
