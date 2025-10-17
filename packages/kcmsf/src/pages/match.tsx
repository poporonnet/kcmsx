import { Box, Button, Divider, Flex, Text } from "@mantine/core";
import { IconRotate, IconSwitchHorizontal } from "@tabler/icons-react";
import { config, MatchType } from "config";
import { Side } from "config/src/types/matchInfo";
import { useCallback, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { MatchNameCard } from "../components/match/MatchNameCard";
import { MatchPointCard } from "../components/match/MatchPointCard";
import { MatchSubmit } from "../components/match/matchSubmit";
import { PointControls } from "../components/match/PointControls";
import { MatchResult } from "../components/MatchResult";
import { useDisplayedTeam } from "../hooks/useDisplayedTeam";
import { useForceReload } from "../hooks/useForceReload";
import { useInterval } from "../hooks/useInterval";
import { useJudge } from "../hooks/useJudge";
import { useMatchEventSender } from "../hooks/useMatchEventSender";
import { useMatchInfo } from "../hooks/useMatchInfo";
import { useMatchTimer } from "../hooks/useMatchTimer";
import { getMatchStatus } from "../utils/matchStatus";
import { parseSeconds } from "../utils/time";

export const Match = () => {
  const { id, matchType } = useParams<{ id: string; matchType: MatchType }>();
  const isExhibition = !id || !matchType;
  const { match, matchInfo, refetch } = useMatchInfo(id, matchType);
  const matchJudge = useJudge(matchInfo);
  const matchTimeSec = config.match[matchInfo?.matchType || "pre"].limitSeconds;
  const {
    totalSeconds,
    isRunning,
    state: timerState,
    switchTimer,
  } = useMatchTimer(matchInfo?.matchType || "pre");
  const forceReload = useForceReload();
  const navigate = useNavigate();
  const matchStatus = useMemo(() => match && getMatchStatus(match), [match]);

  const {
    teams: [leftDisplayedTeam, rightDisplayedTeam],
    displayedCourseName: [leftDisplayedCourseName, rightDisplayedCourseName],
    displayedColor: [leftDisplayedColor, rightDisplayedColor],
    flip,
  } = useDisplayedTeam(matchInfo, matchJudge);

  const sendMatchEvent = useMatchEventSender(matchType, id);

  const onClickReset = useCallback(
    (side: Side) => {
      const team = side == "left" ? leftDisplayedTeam : rightDisplayedTeam;
      team.judge.reset();
      if (team.info) {
        sendMatchEvent({
          type: "TEAM_POINT_STATE_UPDATED",
          teamId: team.info.id,
          pointState: team.judge.point.state,
        });
        sendMatchEvent({
          type: "TEAM_GOAL_TIME_UPDATED",
          teamId: team.info.id,
          goalTimeSeconds: team.judge.goalTimeSeconds,
        });
      }
      forceReload();
    },
    [forceReload, leftDisplayedTeam, rightDisplayedTeam, sendMatchEvent]
  );

  // FIXME: useTimer に tick 時のコールバックがないためとりあえず 500ms おきに送信
  useInterval(
    () =>
      sendMatchEvent({
        type: "TIMER_UPDATED",
        totalSeconds,
        isRunning,
        state: timerState,
      }),
    500,
    { active: matchStatus != "end" }
  );

  return (
    <Flex
      h="100%"
      direction="column"
      gap="md"
      align="center"
      justify="center"
      w="100%"
    >
      {match && matchInfo && matchStatus === "end" ? (
        <MatchResult
          match={match}
          matchInfo={matchInfo}
          onSelectWinner={async (isSucceed) => {
            if (isSucceed) await refetch();
          }}
        />
      ) : (
        <>
          {match && matchInfo && (
            <MatchNameCard
              matchType={matchInfo.matchType}
              matchCode={match.matchCode}
              rightTeamName={rightDisplayedTeam.info?.teamName}
              leftTeamName={leftDisplayedTeam.info?.teamName}
              rightTeamColor={rightDisplayedColor}
              leftTeamColor={leftDisplayedColor}
              centerSection={
                <>
                  {match.matchType === "main" &&
                    `${match.runResults.length == 0 ? 1 : 2}試合目`}
                  <Button
                    onClick={flip}
                    variant="subtle"
                    size="compact-sm"
                    color="violet"
                    leftSection={<IconSwitchHorizontal size={14} />}
                  >
                    左右を反転
                  </Button>
                </>
              }
              leftTeamCourseName={leftDisplayedCourseName}
              rightTeamCourseName={rightDisplayedCourseName}
            />
          )}
          <Button
            w="100%"
            h="auto"
            p="xs"
            variant="filled"
            color={
              timerState == "finished" ? "pink" : isRunning ? "teal" : "gray"
            }
            onClick={switchTimer}
          >
            <Text size="5rem">{parseSeconds(totalSeconds)}</Text>
          </Button>
          <MatchPointCard
            rightTeamPoint={
              isExhibition || rightDisplayedTeam.info
                ? rightDisplayedTeam.judge.point.point()
                : 0
            }
            leftTeamPoint={
              isExhibition || leftDisplayedTeam.info
                ? leftDisplayedTeam.judge.point.point()
                : 0
            }
            leftTeamColor={leftDisplayedColor}
            rightTeamColor={rightDisplayedColor}
            leftSection={
              <Box flex={1}>
                <Button
                  variant="transparent"
                  color={leftDisplayedColor}
                  leftSection={<IconRotate />}
                  size="xl"
                  fw="normal"
                  onClick={() => onClickReset("left")}
                >
                  リセット
                </Button>
              </Box>
            }
            rightSection={
              <Box flex={1}>
                <Button
                  variant="transparent"
                  color={rightDisplayedColor}
                  leftSection={<IconRotate />}
                  size="xl"
                  fw="normal"
                  onClick={() => onClickReset("right")}
                >
                  リセット
                </Button>
              </Box>
            }
          />

          <Divider w="100%" />

          <Flex direction="row" gap="2rem" align="center" justify="center">
            <PointControls
              color={leftDisplayedColor}
              team={leftDisplayedTeam.judge}
              onChange={() => {
                if (leftDisplayedTeam.info) {
                  sendMatchEvent({
                    type: "TEAM_POINT_STATE_UPDATED",
                    teamId: leftDisplayedTeam.info.id,
                    pointState: leftDisplayedTeam.judge.point.state,
                  });
                }
                forceReload();
              }}
              onGoal={(done) => {
                leftDisplayedTeam.goal(
                  done ? matchTimeSec - totalSeconds : undefined
                );
                if (leftDisplayedTeam.info) {
                  sendMatchEvent({
                    type: "TEAM_GOAL_TIME_UPDATED",
                    teamId: leftDisplayedTeam.info.id,
                    goalTimeSeconds: leftDisplayedTeam.judge.goalTimeSeconds,
                  });
                }
              }}
              disabled={!isExhibition && !leftDisplayedTeam.info}
            />

            <Divider orientation="vertical" />

            <PointControls
              color={rightDisplayedColor}
              team={rightDisplayedTeam.judge}
              onChange={() => {
                if (rightDisplayedTeam.info) {
                  sendMatchEvent({
                    type: "TEAM_POINT_STATE_UPDATED",
                    teamId: rightDisplayedTeam.info.id,
                    pointState: rightDisplayedTeam.judge.point.state,
                  });
                }
                forceReload();
              }}
              onGoal={(done) => {
                rightDisplayedTeam.goal(
                  done ? matchTimeSec - totalSeconds : undefined
                );
                if (rightDisplayedTeam.info) {
                  sendMatchEvent({
                    type: "TEAM_GOAL_TIME_UPDATED",
                    teamId: rightDisplayedTeam.info.id,
                    goalTimeSeconds: rightDisplayedTeam.judge.goalTimeSeconds,
                  });
                }
              }}
              disabled={!isExhibition && !rightDisplayedTeam.info}
            />
          </Flex>

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
                  teamName: matchInfo.teams.left.teamName,
                },
                right: matchInfo.teams.right && {
                  points: matchJudge.rightTeam.point.point(),
                  time: matchJudge.rightTeam.goalTimeSeconds,
                  teamName: matchInfo.teams.right.teamName,
                },
              }}
              onSubmit={(isSucceeded) => {
                if (!isSucceeded) return;

                sendMatchEvent({ type: "MATCH_ENDED" });
                navigate(0);
              }}
            />
          )}
        </>
      )}
    </Flex>
  );
};
