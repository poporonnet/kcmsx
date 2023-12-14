import { useState } from "react";
import {
  Button,
  Divider,
  Flex,
  MantineColor,
  Paper,
  Text,
} from "@mantine/core";
import { useParams } from "react-router-dom";
import { useTimer } from "react-timer-hook";
import { expiryTimestamp } from "../utils/expiryTimestamp";

type TimerState = "Initial" | "Started" | "Finished";

export const Match = () => {
  const { id } = useParams();
  const matchTimeSec = 300;
  const [timerState, setTimerState] = useState<TimerState>("Initial");
  const { start, pause, resume, isRunning, minutes, seconds } = useTimer({
    expiryTimestamp: expiryTimestamp(matchTimeSec),
    autoStart: false,
    onExpire: () => setTimerState("Finished"),
  });
  console.log(id);

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
        <Text size="5rem">
          {minutes.toString().padStart(2, "0")}:
          {seconds.toString().padStart(2, "0")}
        </Text>
      </Button>
      <Paper pb="sm" w="100%" withBorder>
        <Flex gap="sm" align="center" justify="center">
          <Text size="4rem" c="blue">
            0
          </Text>
          <Text size="4rem">-</Text>
          <Text size="4rem" c="red">
            0
          </Text>
        </Flex>
      </Paper>
      <Divider w="100%" />
      <Flex direction="row" gap="2rem" align="center" justify="center">
        <Controls color="blue" />
        <Divider orientation="vertical" />
        <Controls color="red" />
      </Flex>
    </Flex>
  );
};

const Controls = (props: { color: MantineColor }) => {
  const fontSize = "1.2";
  return (
    <Flex direction="column" gap="xs">
      <ControlButton color={props.color}>
        <Text size={`${fontSize}rem`}>松江エリアを出た</Text>
      </ControlButton>
      <ControlButton color={props.color}>
        <Text size={`${fontSize}rem`}>中間線を越えた</Text>
      </ControlButton>
      <ControlButton color={props.color}>
        <Text size={`${fontSize}rem`}>金星エリアに入った</Text>
      </ControlButton>
      <ControlButton color={props.color}>
        <Text size={`${fontSize}rem`}>ボールを金星エリアに置いた</Text>
      </ControlButton>
      <ControlButton color={props.color}>
        <Text size={`${fontSize}rem`}>松江エリアに戻った</Text>
      </ControlButton>
      <ControlButton color={props.color}>
        <Text size={`${fontSize}rem`}>ゴール</Text>
      </ControlButton>
      <ControlButton color={props.color}>
        <Text size={`${fontSize}rem`}>雲粒子の数</Text>
      </ControlButton>
    </Flex>
  );
};

const ControlButton = (props: {
  color: MantineColor;
  children: React.ReactElement;
}) => (
  <Button
    w="auto"
    h="auto"
    px="lg"
    py="xs"
    variant="outline"
    color={props.color}
  >
    {props.children}
  </Button>
);
