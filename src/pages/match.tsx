import { Button, Divider, Flex, Paper, Text } from "@mantine/core";
import { useState } from "react";
import { useLocation } from "react-router-dom";
import { useTimer } from "react-timer-hook";
import { MatchSubmit } from "../components/matchSubmit";
import { PointControls } from "../components/pointControls";
import { config } from "../config/config";
import { useForceReload } from "../hooks/useForceReload";
import { Judge } from "../utils/match/judge";
import { expiryTimestamp, parseSeconds } from "../utils/time";

type TimerState = "Initial" | "Started" | "Finished";
export type TeamInfo = {
  id: string;
  teamName: string;
  isMultiWalk: boolean;
  category: "elementary" | "open";
};
export type MatchInfo = {
  id: string;
  teams: { left: TeamInfo; right: TeamInfo };
  matchType: "primary" | "final";
};

export const Match = () => {
  const matchInfo = useLocation().state as MatchInfo | null;
  const isExhibition = matchInfo == null;

  const matchTimeSec = config.match.matchSeconds;
  const [timerState, setTimerState] = useState<TimerState>("Initial");
  const { start, pause, resume, isRunning, totalSeconds } = useTimer({
    expiryTimestamp: expiryTimestamp(matchTimeSec),
    autoStart: false,
    onExpire: () => setTimerState("Finished"),
  });

  const [matchJudge] = useState(
    new Judge(
      { multiWalk: !isExhibition && matchInfo.teams.left.isMultiWalk },
      { multiWalk: !isExhibition && matchInfo.teams.right.isMultiWalk },
      { matchInfo },
      { matchInfo }
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
      {!isExhibition && (
        <MatchSubmit
          matchInfo={matchInfo}
          available={
            (matchJudge.leftTeam.goalTimeSeconds != null &&
              matchJudge.rightTeam.goalTimeSeconds != null) ||
            timerState === "Finished"
          }
          result={{
            left: {
              points: matchJudge.leftTeam.point.point(),
              time: matchJudge.leftTeam.goalTimeSeconds ?? matchTimeSec,
            },
            right: {
              points: matchJudge.rightTeam.point.point(),
              time: matchJudge.rightTeam.goalTimeSeconds ?? matchTimeSec,
            },
          }}
        />
      )}
    </Flex>
  );
};
