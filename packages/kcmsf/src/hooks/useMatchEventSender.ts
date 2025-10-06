import { MatchType } from "config";
import { useCallback } from "react";
import {
  MatchEventMatchEnded,
  MatchEventTeamUpdated,
  MatchEventTimerUpdated,
} from "../types/matchWs";
import { useWebSocket } from "./useWebSocket";

export const useMatchEventSender = (
  matchType: MatchType | undefined,
  matchId: string | undefined
) => {
  const wsRef = useWebSocket(
    `${import.meta.env.VITE_API_URL}/match/${matchType}/${matchId}/ws/update`,
    {}
  );

  const sendTeamUpdated = useCallback(
    (data: Omit<MatchEventTeamUpdated, "type">) => {
      const event: MatchEventTeamUpdated = {
        type: "TEAM_UPDATED",
        ...data,
      };
      wsRef.current?.send(JSON.stringify(event));
    },
    []
  );
  const sendTimerUpdated = useCallback(
    (data: Omit<MatchEventTimerUpdated, "type">) => {
      const event: MatchEventTimerUpdated = {
        type: "TIMER_UPDATED",
        ...data,
      };
      wsRef.current?.send(JSON.stringify(event));
    },
    []
  );
  const sendMatchEnded = useCallback(() => {
    const event: MatchEventMatchEnded = {
      type: "MATCH_ENDED",
    };
    wsRef.current?.send(JSON.stringify(event));
  }, []);

  return { sendTeamUpdated, sendTimerUpdated, sendMatchEnded };
};
