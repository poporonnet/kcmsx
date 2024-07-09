import { ActionIcon, Group, MantineColor, Text } from "@mantine/core";
import {
  IconSquareChevronLeftFilled,
  IconSquareChevronRightFilled,
} from "@tabler/icons-react";
import { useState } from "react";
import { lang } from "../../config/lang/lang";
import { Team } from "../../utils/match/team";

export const PointCountable = (props: {
  color: MantineColor;
  team: Team;
  onChange: () => void;
}) => {
  const [minBallCount, maxBallCount] = [0, 3] as const;
  const [ballCount, setBallCount] = useState(0);
  const decrement = () => {
    if (ballCount == minBallCount) return;
    setBallCount((current) => current - 1);
    props.team.point.state.bringBall = ballCount - 1;
    props.onChange();
  };
  const increment = () => {
    if (ballCount == maxBallCount) return;
    setBallCount((current) => current + 1);
    props.team.point.state.bringBall = ballCount + 1;
    props.onChange();
  };
  return (
    <Group>
      <Text size="1.2rem" c={props.color} style={{ flexGrow: 1 }}>
        {lang.match.numberOfBall}:
      </Text>
      <ActionIcon
        size="xl"
        variant="transparent"
        onClick={decrement}
        c={ballCount > minBallCount ? props.color : undefined}
        disabled={ballCount == minBallCount}
        bg="white"
      >
        <IconSquareChevronLeftFilled
          style={{ width: "100%", height: "100%" }}
        />
      </ActionIcon>
      <Text w="auto" size="xl" style={{ flexGrow: 1 }}>
        {ballCount}
      </Text>
      <ActionIcon
        size="xl"
        variant="transparent"
        onClick={increment}
        c={ballCount < maxBallCount ? props.color : undefined}
        disabled={ballCount == maxBallCount}
        bg="white"
      >
        <IconSquareChevronRightFilled
          style={{ width: "100%", height: "100%" }}
        />
      </ActionIcon>
    </Group>
  );
};
