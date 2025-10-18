import { Badge, Button, Divider, Flex, Text } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import {
  IconDeviceTv,
  IconDeviceTvOff,
  IconSwitchHorizontal,
} from "@tabler/icons-react";
import { config, MatchType } from "config";
import { Side } from "config/src/types/matchInfo";
import { useCallback, useMemo, useState } from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { MatchNameCard } from "../components/match/MatchNameCard";
import { MatchPointCard } from "../components/match/MatchPointCard";
import { PointControls } from "../components/match/PointControls";
import { useDisplayedTeam } from "../hooks/useDisplayedTeam";
import { useForceReload } from "../hooks/useForceReload";
import { useJudge } from "../hooks/useJudge";
import { useMatchEventListener } from "../hooks/useMatchEventListener";
import { useMatchInfo } from "../hooks/useMatchInfo";
import { TimerState } from "../hooks/useMatchTimer";
import { MatchEvent } from "../types/matchWs";
import { getMatchStatus } from "../utils/matchStatus";
import { parseSeconds } from "../utils/time";

export const MatchView = () => {
  const { id, matchType } = useParams<{ id: string; matchType: MatchType }>();
  const isExhibition = !id || !matchType;
  const { match, matchInfo } = useMatchInfo(id, matchType);
  const matchJudge = useJudge(matchInfo);
  const forceReload = useForceReload();
  const navigate = useNavigate();
  const matchStatus = useMemo(() => match && getMatchStatus(match), [match]);

  const {
    teams: [leftDisplayedTeam, rightDisplayedTeam],
    displayedCourseName: [leftDisplayedCourseName, rightDisplayedCourseName],
    displayedColor: [leftDisplayedColor, rightDisplayedColor],
    flip,
  } = useDisplayedTeam(matchInfo, matchJudge);

  const [isRunning, setIsRunning] = useState(false);
  const [timerState, setTimerState] = useState<TimerState>("initial");
  const [totalSeconds, setTotalSeconds] = useState<number>(
    config.match[matchType ?? "pre"].limitSeconds
  );

  const getSide = useCallback(
    (teamId: string): Side => {
      if (matchInfo?.teams.left?.id === teamId) return "left";
      if (matchInfo?.teams.right?.id === teamId) return "right";

      throw new Error("TeamId not matched");
    },
    [matchInfo?.teams.left?.id, matchInfo?.teams.right?.id]
  );
  const onMatchEvent = useCallback(
    (event: MatchEvent) => {
      switch (event.type) {
        case "TIMER_UPDATED": {
          const { isRunning, state, totalSeconds } = event;
          if (isRunning != null) setIsRunning(isRunning);
          if (state != null) setTimerState(state);
          if (totalSeconds != null) setTotalSeconds(totalSeconds);
          break;
        }
        case "TEAM_POINT_STATE_UPDATED": {
          const { teamId, pointState } = event;
          matchJudge.team(getSide(teamId)).point.reset(pointState);
          forceReload();
          break;
        }
        case "TEAM_GOAL_TIME_UPDATED": {
          const { teamId, goalTimeSeconds } = event;
          matchJudge.goal(getSide(teamId), goalTimeSeconds);
          forceReload();
          break;
        }
        case "MATCH_ENDED":
          // 予選ならリロード後にリダイレクトが発火
          // 本戦1試合目ならリロードのみ、2試合目ならリロード後にリダイレクトが発火
          navigate(0);
          break;
        default:
          throw new Error("Unknown match event:", { cause: event });
      }
    },
    [matchJudge, forceReload, navigate, getSide]
  );

  const [isViewError, setIsViewError] = useState(false);
  useMatchEventListener(
    matchType,
    id,
    onMatchEvent,
    () => {
      setIsViewError(true);
      notifications.show({
        title: "観戦に失敗しました",
        message: "WebSocketの接続中にエラーが発生しました",
        color: "red",
        autoClose: false,
      });
    },
    (event) => {
      setIsViewError(true);
      notifications.show({
        title: "観戦から切断されました",
        message: `WebSocketが切断されました ( code: ${event.code} )`,
        color: "red",
        autoClose: false,
      });
    }
  );

  if (matchStatus === "end")
    return <Navigate to={`/match/${matchType}/${id}`} replace />;

  return (
    <Flex
      h="100%"
      direction="column"
      gap="md"
      align="center"
      justify="center"
      w="100%"
    >
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
              <Badge
                size="lg"
                color={!isViewError ? "green" : "red"}
                leftSection={
                  !isViewError ? (
                    <IconDeviceTv size={18} />
                  ) : (
                    <IconDeviceTvOff size={18} />
                  )
                }
              >
                {!isViewError ? "観戦中" : "エラー"}
              </Badge>
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
        color={timerState == "finished" ? "pink" : isRunning ? "teal" : "gray"}
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
      />

      <Divider w="100%" />

      <Flex direction="row" gap="2rem" align="center" justify="center">
        <PointControls
          color={leftDisplayedColor}
          team={leftDisplayedTeam.judge}
          onChange={() => {}}
          onGoal={() => {}}
          disabled={!isExhibition && !leftDisplayedTeam.info}
          unclickable
        />

        <Divider orientation="vertical" />

        <PointControls
          color={rightDisplayedColor}
          team={rightDisplayedTeam.judge}
          onChange={() => {}}
          onGoal={() => {}}
          disabled={!isExhibition && !rightDisplayedTeam.info}
          unclickable
        />
      </Flex>
    </Flex>
  );
};
