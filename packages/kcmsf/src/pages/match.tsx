import { Button, Divider, Flex, Text } from "@mantine/core";
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
import { useJudge } from "../hooks/useJudge";
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
    displayedSide: displayedSide,
    flip,
  } = useDisplayedTeam(matchInfo, matchJudge);

  const onClickReset = useCallback(
    (side: Side) => {
      (side == "left" ? leftDisplayedTeam : rightDisplayedTeam).judge.reset();
      forceReload();
    },
    [matchJudge, forceReload]
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
              side={displayedSide}
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
            leftSection={
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
            }
            rightSection={
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
            }
          />

          <Divider w="100%" />

          <Flex direction="row" gap="2rem" align="center" justify="center">
            <PointControls
              color="blue"
              team={leftDisplayedTeam.judge}
              onChange={forceReload}
              onGoal={(done) =>
                leftDisplayedTeam.goal(
                  done ? matchTimeSec - totalSeconds : undefined
                )
              }
              disabled={!isExhibition && !leftDisplayedTeam.info}
            />

            <Divider orientation="vertical" />

            <PointControls
              color="red"
              team={rightDisplayedTeam.judge}
              onChange={forceReload}
              onGoal={(done) =>
                rightDisplayedTeam.goal(
                  done ? matchTimeSec - totalSeconds : undefined
                )
              }
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

                navigate(0);
              }}
            />
          )}
        </>
      )}
    </Flex>
  );
};
