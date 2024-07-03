import {
  ActionIcon,
  Button,
  Flex,
  Group,
  MantineColor,
  Text,
} from "@mantine/core";
import {
  IconSquareChevronLeftFilled,
  IconSquareChevronRightFilled,
} from "@tabler/icons-react";
import { useState } from "react";
import { lang } from "../config/lang/lang";
import { Team } from "../utils/match/team";
import { parseSeconds } from "../utils/time";

export const PointControls = (props: {
  color: MantineColor;
  team: Team;
  onChange: () => void;
  onGoal: (done: boolean) => void;
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
    <Flex direction="column" gap="xs">
      <ControlButton
        color={props.color}
        onChange={(active) => {
          props.team.point.state.leaveBase = active;
          props.onChange();
        }}
      >
        {lang.match.leaveBase}
      </ControlButton>
      <ControlButton
        color={props.color}
        onChange={(active) => {
          props.team.point.state.overMiddle = active;
          props.onChange();
        }}
      >
        {lang.match.overMiddle}
      </ControlButton>
      <ControlButton
        color={props.color}
        onChange={(active) => {
          props.team.point.state.enterDestination = active;
          props.onChange();
        }}
      >
        {lang.match.enterDistination}
      </ControlButton>
      <ControlButton
        color={props.color}
        onChange={(active) => {
          props.team.point.state.placeBall = active;
          props.onChange();
        }}
      >
        {lang.match.placeBall}
      </ControlButton>
      <ControlButton
        color={props.color}
        onChange={(active) => {
          props.team.point.state.returnBase = active;
          props.onChange();
        }}
      >
        {lang.match.returnBase}
      </ControlButton>
      <ControlButton
        color={props.color}
        onChange={(done) => {
          props.onGoal(done);
          props.onChange();
        }}
      >
        {lang.match.goal}{" "}
        {props.team.goalTimeSeconds != null &&
          parseSeconds(props.team.goalTimeSeconds)}
      </ControlButton>
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
    </Flex>
  );
};

const ControlButton = (props: {
  color: MantineColor;
  onChange: (active: boolean) => void;
  children: React.ReactNode;
}) => {
  const [active, setActive] = useState(false);

  return (
    <Button
      w="auto"
      h="auto"
      px="lg"
      py="xs"
      variant={active ? "filled" : "outline"}
      color={props.color}
      onClick={() => {
        props.onChange(!active);
        setActive(() => !active);
      }}
    >
      <Text size="1.2rem">{props.children}</Text>
    </Button>
  );
};
