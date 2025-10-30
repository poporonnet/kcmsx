import { MatchType } from "config";
import { useCallback } from "react";
import { MatchEvent } from "../types/matchWs";
import { useWebSocket } from "./useWebSocket";

export const useMatchEventSender = (
  matchType: MatchType | undefined,
  matchId: string | undefined,
  optionListener?: {
    onOpen?: (event: Event) => void;
    onMessage?: (event: MessageEvent) => void;
    onError?: (event: Event) => void;
    onClose?: (event: CloseEvent) => void;
    onReconnect?: (event: Event) => void;
  }
) => {
  const wsRef = useWebSocket(
    `${import.meta.env.VITE_API_URL}/match/${matchType}/${matchId}/ws/update`,
    optionListener
  );

  const send = useCallback(
    (event: MatchEvent) => wsRef.current?.send(JSON.stringify(event)),
    [wsRef]
  );

  return send;
};
