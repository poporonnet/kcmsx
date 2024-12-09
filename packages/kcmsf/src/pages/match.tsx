import { Button, Divider, Flex, Paper, Text } from "@mantine/core";
import { IconRotate } from "@tabler/icons-react";
import { config, MatchType } from "config";
import { Side } from "config/src/types/matchInfo";
import { useCallback, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { MatchNameCard } from "../components/match/MatchNameCard";
import { MatchPointViewer } from "../components/match/MatchPointCard";
import { MatchSubmit } from "../components/match/matchSubmit";
import { PointControls } from "../components/match/PointControls";
import { MatchResult } from "../components/matchResult";
import { StatusButtonProps } from "../components/matchStatus";
import { useForceReload } from "../hooks/useForceReload";
import { useJudge } from "../hooks/useJudge";
import { useMatchInfo } from "../hooks/useMatchInfo";
import { useMatchTimer } from "../hooks/useMatchTimer";
import { getMatchStatus } from "../utils/matchStatus";
import { parseSeconds } from "../utils/time";

export const Match = () => {
  const { id, matchType } = useParams<{ id: string; matchType: MatchType }>();
  const isExhibition = !id || !matchType;
  const { match, matchInfo } = useMatchInfo(id, matchType);
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
  const onClickReset = useCallback(
    (side: Side) => {
      matchJudge.team(side).reset();
      forceReload();
    },
    [matchJudge, forceReload]
  );
  const matchStatus: StatusButtonProps["status"] | undefined = useMemo(() => {
    if (match) {
      return getMatchStatus(match);
    }
    return undefined;
  }, [match]);

  return (
    <>
      {matchStatus === "end" ? (
        <MatchResult match={match!} matchInfo={matchInfo!} />
      ) : (
        <Flex
          h="100%"
          direction="column"
          gap="md"
          align="center"
          justify="center"
        >
          {matchInfo && <MatchNameCard match={match!} matchInfo={matchInfo} />}
          <Button
            w="100%"
            h="auto"
            pb="sm"
            variant="filled"
            color={
              timerState == "finished" ? "pink" : isRunning ? "teal" : "gray"
            }
            onClick={switchTimer}
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
                onClick={() => onClickReset("left")}
              >
                リセット
              </Button>
              <MatchPointViewer
                IsExhibition={isExhibition}
                MatchInfo={matchInfo}
                RightTeamPoint={matchJudge.rightTeam.point.point()}
                LeftTeamPoint={matchJudge.leftTeam.point.point()}
              />
              <Button
                flex={1}
                variant="transparent"
                c="red"
                leftSection={<IconRotate />}
                size="xl"
                fw="normal"
                onClick={() => onClickReset("right")}
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

                navigate(`/matchlist?match_type=${matchType}`, {
                  viewTransition: true,
                });
              }}
            />
          )}
        </Flex>
      )}
    </>
  );
};
