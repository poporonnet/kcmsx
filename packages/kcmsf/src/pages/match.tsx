import { Button, Divider, Flex, Paper, Text } from "@mantine/core";
import { config, MatchInfo, MatchType, RobotType } from "config";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useTimer } from "react-timer-hook";
import { MatchSubmit } from "../components/match/matchSubmit";
import { PointControls } from "../components/match/PointControls";
import { useForceReload } from "../hooks/useForceReload";
import { Judge } from "../utils/match/judge";
import { expiryTimestamp, parseSeconds } from "../utils/time";

type TimerState = "Initial" | "Started" | "Finished";
type TeamFetchRes = {
  id: string;
  name: string;
  entryId: string;
  members: string[2];
  clubName: string;
  robotType: RobotType;
  category: "elementary" | "open";
  isEntered: boolean;
};
export const Match = () => {
  const { id, matchType } = useParams<{ id: string; matchType: MatchType }>();
  const isExhibition = id == null || matchType == null;
  const [matchInfo, setMatchInfo] = useState<MatchInfo | undefined>(undefined);
  const [matchJudge, setMatchJudge] = useState<Judge>(
    new Judge(
      { multiWalk: false },
      { multiWalk: false },
      { matchInfo },
      { matchInfo }
    )
  );
  useEffect(() => {
    const fetchMatchInfo = async () => {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/match/${matchType}/${id}`,
        { method: "GET" }
      );
      const data = (await res.json()) as {
        id: string;
        matchType: MatchType;
        left: { id: string; teamName: string };
        right: { id: string; teamName: string };
      };
      const leftres = await fetch(
        `${import.meta.env.VITE_API_URL}/team/${data.left.id}`,
        { method: "GET" }
      );
      const leftdata = (await leftres.json()) as TeamFetchRes;

      const rightres = await fetch(
        `${import.meta.env.VITE_API_URL}/team/${data.right.id}`,
        { method: "GET" }
      );
      const rightdata = (await rightres.json()) as TeamFetchRes;

      const matchInfo: MatchInfo = {
        id: data.id,
        matchType: data.matchType,
        teams: {
          left: {
            id: leftdata.id,
            teamName: leftdata.name,
            isMultiWalk: leftdata.robotType === "leg" ? true : false,
            category: leftdata.category,
          },
          right: {
            id: rightdata.id,
            teamName: rightdata.name,
            isMultiWalk: rightdata.robotType === "leg" ? true : false,
            category: rightdata.category,
          },
        },
      };
      setMatchInfo(matchInfo);
      setMatchJudge(
        new Judge(
          { multiWalk: !isExhibition && matchInfo?.teams.left.isMultiWalk },
          { multiWalk: !isExhibition && matchInfo?.teams.right.isMultiWalk },
          { matchInfo },
          { matchInfo }
        )
      );
    };
    if (isExhibition) return;
    fetchMatchInfo();
  }, []);
  const matchTimeSec = config.match[matchInfo?.matchType || "pre"].limitSeconds;
  const [timerState, setTimerState] = useState<TimerState>("Initial");
  const { start, pause, resume, isRunning, totalSeconds } = useTimer({
    expiryTimestamp: expiryTimestamp(matchTimeSec),
    autoStart: false,
    onExpire: () => setTimerState("Finished"),
  });
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
          {!isExhibition && matchInfo && (
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
          {!isExhibition && matchInfo && (
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
      {!isExhibition && matchInfo && (
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
