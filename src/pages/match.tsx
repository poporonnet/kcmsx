import { useState } from "react";
import {
  ActionIcon,
  Button,
  Divider,
  Flex,
  Group,
  MantineColor,
  Paper,
  Text,
} from "@mantine/core";
import { useTimer } from "react-timer-hook";
import {
  IconSquareChevronLeftFilled,
  IconSquareChevronRightFilled,
} from "@tabler/icons-react";
import { expiryTimestamp, parseSeconds } from "../utils/time";
import { Judge } from "../utils/match/judge";
import { useForceReload } from "../hooks/useForceReload";
import { Team } from "../utils/match/team";
import { useLocation } from "react-router-dom";

type TimerState = "Initial" | "Started" | "Finished";
type TeamInfo = {
  id: string;
  teamName: string;
  isMultiWalk: boolean;
  category: "Elementary" | "Open";
};
export type MatchInfo = {
  id: string;
  teams: { left: TeamInfo; right: TeamInfo };
  matchType: "primary" | "final";
};

export const Match = () => {
  const matchInfo = useLocation().state as MatchInfo;
  const isExhibition = matchInfo == null;

  const matchTimeSec = 300;
  const [timerState, setTimerState] = useState<TimerState>("Initial");
  const { start, pause, resume, isRunning, totalSeconds } = useTimer({
    expiryTimestamp: expiryTimestamp(matchTimeSec),
    autoStart: false,
    onExpire: () => setTimerState("Finished"),
  });

  const [matchJudge] = useState(
    new Judge(
      { multiWalk: !isExhibition && matchInfo.teams.left.isMultiWalk },
      { multiWalk: !isExhibition && matchInfo.teams.right.isMultiWalk }
    )
  );
  const forceReload = useForceReload();

  const onClickTimer = () => {
    if (timerState == "Initial") {
      start();
      setTimerState("Started");
      return;
    }

    if (isRunning) {
      pause();
    } else {
      resume();
    }
  };

  return (
    <Flex h="100%" direction="column" gap="md" align="center" justify="center">
      <Button
        w="100%"
        h="auto"
        pb="sm"
        variant="filled"
        color={timerState == "Finished" ? "pink" : isRunning ? "teal" : "gray"}
        onClick={onClickTimer}
      >
        <Text size="5rem">{parseSeconds(totalSeconds)}</Text>
      </Button>
      <Paper w="100%" withBorder>
        <Flex align="center" justify="center">
          {!isExhibition && (
            <Text pl="md" size="2rem" c="blue" style={{ flex: 1 }}>
              {matchInfo.teams.left.teamName}
            </Text>
          )}
          <Flex pb="sm" gap="sm">
            <Text size="4rem" c="blue">
              {matchJudge.leftTeam.point.point()}
            </Text>
            <Text size="4rem">-</Text>
            <Text size="4rem" c="red">
              {matchJudge.rightTeam.point.point()}
            </Text>
          </Flex>
          {!isExhibition && (
            <Text pr="md" size="2rem" c="red" style={{ flex: 1 }}>
              {matchInfo.teams.right.teamName}
            </Text>
          )}
        </Flex>
      </Paper>
      <Divider w="100%" />
      <Flex direction="row" gap="2rem" align="center" justify="center">
        <PointControls
          color="blue"
          team={matchJudge.leftTeam}
          onChange={forceReload}
          onGoal={(done) =>
            matchJudge.goalLeftTeam(done ? matchTimeSec - totalSeconds : null)
          }
        />
        <Divider orientation="vertical" />
        <PointControls
          color="red"
          team={matchJudge.rightTeam}
          onChange={forceReload}
          onGoal={(done) =>
            matchJudge.goalRightTeam(done ? matchTimeSec - totalSeconds : null)
          }
        />
      </Flex>
    </Flex>
  );
};

const PointControls = (props: {
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
        松江エリアを出た
      </ControlButton>
      <ControlButton
        color={props.color}
        onChange={(active) => {
          props.team.point.state.overMiddle = active;
          props.onChange();
        }}
      >
        中間線を越えた
      </ControlButton>
      <ControlButton
        color={props.color}
        onChange={(active) => {
          props.team.point.state.enterDestination = active;
          props.onChange();
        }}
      >
        金星エリアに入った
      </ControlButton>
      <ControlButton
        color={props.color}
        onChange={(active) => {
          props.team.point.state.placeBall = active;
          props.onChange();
        }}
      >
        ボールを金星エリアに置いた
      </ControlButton>
      <ControlButton
        color={props.color}
        onChange={(active) => {
          props.team.point.state.returnBase = active;
          props.onChange();
        }}
      >
        松江エリアに戻った
      </ControlButton>
      <ControlButton
        color={props.color}
        onChange={(done) => {
          props.onGoal(done);
          props.onChange();
        }}
      >
        ゴール{" "}
        {props.team.goalTimeSeconds != null &&
          parseSeconds(props.team.goalTimeSeconds)}
      </ControlButton>
      <Group>
        <Text size="1.2rem" c={props.color} style={{ flexGrow: 1 }}>
          雲粒子の数:
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
