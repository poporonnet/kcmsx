import { Button, Divider, Flex, Paper, Text } from "@mantine/core";
import { IconRotate } from "@tabler/icons-react";
import { config, MatchInfo, MatchType } from "config";
import { Side } from "config/src/types/matchInfo";
import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useTimer } from "react-timer-hook";
import { MatchSubmit } from "../components/match/matchSubmit";
import { PointControls } from "../components/match/PointControls";
import { useForceReload } from "../hooks/useForceReload";
import { GetMatchResponse } from "../types/api/match";
import { GetTeamResponse } from "../types/api/team";
import { MainMatch, PreMatch, Match as TMatch } from "../types/match";
import { Judge } from "../utils/match/judge";
import { expiryTimestamp, parseSeconds } from "../utils/time";
import { MatchResult } from "./matchResult";

type TimerState = "initial" | "counting" | "finished";

type DiscriminatedMatch =
  | (PreMatch & { matchType: "pre" })
  | (MainMatch & { matchType: "main" });

export const Match = () => {
  const { id, matchType } = useParams<{ id: string; matchType: MatchType }>();
  const isExhibition = !id || !matchType;
  const [matchInfo, setMatchInfo] = useState<MatchInfo>();
  const [matchJudge, setMatchJudge] = useState<Judge>(
    new Judge({}, {}, { matchInfo }, { matchInfo })
  );
  const [matchCode, setMatchCode] = useState<string>();
  const [isMatchEnded, setIsMatchEnded] = useState<boolean>(false);
  useEffect(() => {
    if (isExhibition) return;

    const isMainMatch = (
      matchType: MatchType,
      _matchResponse: TMatch
    ): _matchResponse is MainMatch => matchType === "main";

    const getTeam = async (teamID: string): Promise<GetTeamResponse> => {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/team/${teamID}`,
        { method: "GET" }
      );
      return await res.json();
    };

    const fetchMatchInfo = async () => {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/match/${matchType}/${id}`,
        { method: "GET" }
      );
      if (!res.ok) return;

      const matchData = (await res.json()) as GetMatchResponse;
      if (matchData.runResults.length >= 2) {
        setIsMatchEnded(true);
      }
      const match: DiscriminatedMatch = isMainMatch(matchType, matchData)
        ? { ...matchData, matchType: "main" }
        : { ...matchData, matchType: "pre" };

      const leftTeamID =
        match.matchType == "main" ? match.team1.id : match.leftTeam?.id;
      const leftTeam = leftTeamID ? await getTeam(leftTeamID) : undefined;

      const rightTeamID =
        match.matchType == "main" ? match.team2.id : match.rightTeam?.id;
      const rightTeam = rightTeamID ? await getTeam(rightTeamID) : undefined;

      const matchInfo: MatchInfo = {
        id: matchData.id,
        matchType,
        teams: {
          left: leftTeam
            ? {
                id: leftTeam.id,
                teamName: leftTeam.name,
                robotType: leftTeam.robotType,
                departmentType: leftTeam.departmentType,
              }
            : undefined,
          right: rightTeam
            ? {
                id: rightTeam.id,
                teamName: rightTeam.name,
                robotType: rightTeam.robotType,
                departmentType: rightTeam.departmentType,
              }
            : undefined,
        },
      };
      setMatchInfo(matchInfo);
      setMatchJudge(new Judge({}, {}, { matchInfo }, { matchInfo }));
      setMatchCode(matchData.matchCode);
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

  const resetPointState = useCallback(
    (side: Side) => {
      matchJudge.team(side).reset();
      forceReload();
    },
    [matchJudge, forceReload]
  );

  return (
    <>
      {isMatchEnded ? (
        <>
          <MatchResult />
        </>
      ) : (
        <Flex
          h="100%"
          direction="column"
          gap="md"
          align="center"
          justify="center"
        >
          {matchInfo && (
            <Paper w="100%" p="xs" withBorder>
              <Flex direction="row" align="center" justify="center">
                <Text size="2rem" c="blue" flex={1}>
                  {matchInfo?.teams.left?.teamName}
                </Text>
                <Flex
                  direction="column"
                  align="center"
                  justify="center"
                  c="dark"
                >
                  {config.match[matchInfo?.matchType].name}
                  <Text size="2rem">#{matchCode}</Text>
                </Flex>
                <Text size="2rem" c="red" flex={1}>
                  {matchInfo?.teams.right?.teamName}
                </Text>
              </Flex>
            </Paper>
          )}
          <Button
            w="100%"
            h="auto"
            pb="sm"
            variant="filled"
            color={
              timerState == "finished" ? "pink" : isRunning ? "teal" : "gray"
            }
            onClick={onClickTimer}
          >
            <Text size="5rem">{parseSeconds(totalSeconds)}</Text>
          </Button>
          <Paper w="100%" withBorder>
            <Flex align="center" justify="center">
              <Button
                flex={1}
                variant="transparent"
                c="blue"
                leftSection={<IconRotate />}
                size="xl"
                fw="normal"
                onClick={() => resetPointState("left")}
              >
                リセット
              </Button>
              <Flex pb="sm" gap="sm">
                <Text size="4rem" c="blue">
                  {isExhibition || matchInfo?.teams.left
                    ? matchJudge.leftTeam.point.point()
                    : 0}
                </Text>
                <Text size="4rem">-</Text>
                <Text size="4rem" c="red">
                  {isExhibition || matchInfo?.teams.right
                    ? matchJudge.rightTeam.point.point()
                    : 0}
                </Text>
              </Flex>
              <Button
                flex={1}
                variant="transparent"
                c="red"
                leftSection={<IconRotate />}
                size="xl"
                fw="normal"
                onClick={() => resetPointState("right")}
              >
                リセット
              </Button>
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
                disabled={!isExhibition && !matchInfo?.teams.left}
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
                disabled={!isExhibition && !matchInfo?.teams.right}
              />
            </Flex>
          )}
          {!isExhibition && matchInfo && matchJudge && (
            <MatchSubmit
              matchInfo={matchInfo}
              available={
                timerState == "finished" ||
                ((!matchInfo.teams.left ||
                  matchJudge.leftTeam.goalTimeSeconds != null ||
                  matchJudge.leftTeam.point.state.finish) &&
                  (!matchInfo.teams.right ||
                    matchJudge.rightTeam.goalTimeSeconds != null ||
                    matchJudge.rightTeam.point.state.finish))
              }
              result={{
                left: matchInfo.teams.left && {
                  points: matchJudge.leftTeam.point.point(),
                  time: matchJudge.leftTeam.goalTimeSeconds,
                },
                right: matchInfo.teams.right && {
                  points: matchJudge.rightTeam.point.point(),
                  time: matchJudge.rightTeam.goalTimeSeconds,
                },
              }}
            />
          )}
        </Flex>
      )}
    </>
  );
};
