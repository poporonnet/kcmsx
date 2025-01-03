import { Button, Divider, Flex, Paper, Text } from "@mantine/core";
import { IconRotate } from "@tabler/icons-react";
import { config, MatchType } from "config";
import { Side } from "config/src/types/matchInfo";
import { useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { MatchSubmit } from "../components/match/matchSubmit";
import { PointControls } from "../components/match/PointControls";
import { useForceReload } from "../hooks/useForceReload";
import { useJudge } from "../hooks/useJudge";
import { useMatchInfo } from "../hooks/useMatchInfo";
import { useMatchTimer } from "../hooks/useMatchTimer";
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
  return (
    <Flex h="100%" direction="column" gap="md" align="center" justify="center">
      {matchInfo && (
        <Paper w="100%" p="xs" withBorder>
          <Flex direction="row" align="center" justify="center">
            <Text size="2rem" c="blue" flex={1}>
              {matchInfo?.teams.left?.teamName}
            </Text>
            <Flex direction="column" align="center" justify="center" c="dark">
              {config.match[matchInfo?.matchType].name}
              <Text size="2rem">#{match?.matchCode}</Text>
              {match?.matchType == "main" &&
                `${match.runResults.length == 0 ? 1 : 2}試合目`}
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
        color={timerState == "finished" ? "pink" : isRunning ? "teal" : "gray"}
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
  );
};
