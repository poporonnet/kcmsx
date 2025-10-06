import { MatchType } from "config";
import { useEffect, useRef } from "react";
import { MatchEvent } from "../types/matchWs";
import { useWebSocket } from "./useWebSocket";

export const useMatchEventListener = (
  matchType: MatchType | undefined,
  matchId: string | undefined,
  onMatchEvent: (event: MatchEvent) => void
) => {
  if (matchType == null || matchId == null) throw new Error("Not implemented");

  const onMatchEventRef = useRef(onMatchEvent);

  useEffect(() => {
    onMatchEventRef.current = onMatchEvent;
  }, [onMatchEvent]);

  useWebSocket(
    `${import.meta.env.VITE_API_URL}/match/${matchType}/${matchId}/ws/view`,
    {
      onMessage: (event) => {
        // FIXME: バリデーション
        const matchEvent = JSON.parse(event.data) as MatchEvent;
        onMatchEventRef.current(matchEvent);
      },
    }
  );
};
