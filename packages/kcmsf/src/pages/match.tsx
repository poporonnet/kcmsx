import { Button, Divider, Flex, Paper, Text } from "@mantine/core";
import {
  config,
  DepartmentType,
  MatchInfo,
  MatchType,
  RobotType,
} from "config";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useTimer } from "react-timer-hook";
import { MatchSubmit } from "../components/match/matchSubmit";
import { PointControls } from "../components/match/PointControls";
import { useForceReload } from "../hooks/useForceReload";
import { Judge } from "../utils/match/judge";
import { expiryTimestamp, parseSeconds } from "../utils/time";

type TimerState = "initial" | "counting" | "finished";
type GetTeamResponse = {
  id: string;
  name: string;
  entryCode: string;
  members: string[];
  clubName: string;
  robotType: RobotType;
  departmentType: DepartmentType;
  isEntered: boolean;
};
type GetMatchResponse = {
  id: string;
  matchCode: string;
  leftTeam: { id: string; teamName: string };
  rightTeam: { id: string; teamName: string };
  // TODO: RunResultの扱い
};
export const Match = () => {
  const { id, matchType } = useParams<{ id: string; matchType: MatchType }>();
  const isExhibition = !id || !matchType;
  const [matchInfo, setMatchInfo] = useState<MatchInfo>();
  const [matchJudge, setMatchJudge] = useState<Judge | undefined>(
    isExhibition
      ? new Judge(
          { multiWalk: false },
          { multiWalk: false },
          { matchInfo },
          { matchInfo }
        )
      : undefined
  );
  useEffect(() => {
    if (isExhibition) return;
    const fetchMatchInfo = async () => {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/match/${matchType}/${id}`,
        { method: "GET" }
      );
      const match = (await res.json()) as GetMatchResponse;
      const leftRes = await fetch(
        `${import.meta.env.VITE_API_URL}/team/${match.leftTeam.id}`,
        { method: "GET" }
      );
      const leftTeam = (await leftRes.json()) as GetTeamResponse;

      const rightRes = await fetch(
        `${import.meta.env.VITE_API_URL}/team/${match.rightTeam.id}`,
        { method: "GET" }
      );
      const rightTeam = (await rightRes.json()) as GetTeamResponse;

      const matchInfo: MatchInfo = {
        id: match.id,
        matchType,
        teams: {
          left: {
            id: leftTeam.id,
            teamName: leftTeam.name,
            robotType: leftTeam.robotType,
            departmentType: leftTeam.departmentType,
          },
          right: {
            id: rightTeam.id,
            teamName: rightTeam.name,
            robotType: rightTeam.robotType,
            departmentType: rightTeam.departmentType,
          },
        },
      };
      setMatchInfo(matchInfo);
      setMatchJudge(
        new Judge(
          { multiWalk: !isExhibition && matchInfo?.teams.left.robotType == "leg" },
          { multiWalk: !isExhibition && matchInfo?.teams.right.robotType == "leg" },
          { matchInfo },
          { matchInfo }
        )
      );
    };
    fetchMatchInfo();
  }, [id, isExhibition, matchType]);
  const matchTimeSec = config.match[matchInfo?.matchType || "pre"].limitSeconds;
  const [timerState, setTimerState] = useState<TimerState>("initial");
  const { start, pause, resume, isRunning, totalSeconds } = useTimer({
    expiryTimestamp: expiryTimestamp(matchTimeSec),
    autoStart: false,
    onExpire: () => setTimerState("finished"),
  });
  const forceReload = useForceReload();

  const onClickTimer = () => {
    if (timerState == "initial") {
      start();
      setTimerState("counting");
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
        color={timerState == "finished" ? "pink" : isRunning ? "teal" : "gray"}
        onClick={onClickTimer}
      >
        <Text size="5rem">{parseSeconds(totalSeconds)}</Text>
      </Button>
      <Paper w="100%" withBorder>
        <Flex align="center" justify="center">
          {!isExhibition && matchInfo && (
            <Text pl="md" size="2rem" c="blue" style={{ flex: 1 }}>
              {matchInfo.teams.left.teamName}
            </Text>
          )}
          <Flex pb="sm" gap="sm">
            <Text size="4rem" c="blue">
              {matchJudge && matchJudge.leftTeam.point.point()}
            </Text>
            <Text size="4rem">-</Text>
            <Text size="4rem" c="red">
              {matchJudge && matchJudge.rightTeam.point.point()}
            </Text>
          </Flex>
          {!isExhibition && matchInfo && (
            <Text pr="md" size="2rem" c="red" style={{ flex: 1 }}>
              {matchInfo.teams.right.teamName}
            </Text>
          )}
        </Flex>
      </Paper>
      <Divider w="100%" />
      {matchJudge && (
        <Flex direction="row" gap="2rem" align="center" justify="center">
          <PointControls
            color="blue"
            team={matchJudge.leftTeam}
            onChange={forceReload}
            onGoal={(done) =>
              matchJudge.goalLeftTeam(
                done ? matchTimeSec - totalSeconds : undefined
              )
            }
          />
          <Divider orientation="vertical" />
          <PointControls
            color="red"
            team={matchJudge.rightTeam}
            onChange={forceReload}
            onGoal={(done) =>
              matchJudge.goalRightTeam(
                done ? matchTimeSec - totalSeconds : undefined
              )
            }
          />
        </Flex>
      )}
      {!isExhibition && matchInfo && matchJudge && (
        <MatchSubmit
          matchInfo={matchInfo}
          available={
            ((matchJudge.leftTeam.goalTimeSeconds != null ||
              matchJudge.leftTeam.point.state.finish) &&
              (matchJudge.rightTeam.goalTimeSeconds != null ||
                matchJudge.rightTeam.point.state.finish)) ||
            timerState === "finished"
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
