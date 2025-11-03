import { MatchType } from "config";
import { MatchEvent } from "../types/matchWs";
import { useWebSocket } from "./useWebSocket";

export const useMatchEventListener = (
  matchType: MatchType | undefined,
  matchId: string | undefined,
  onMatchEvent: (event: MatchEvent) => void,
  optionListener?: {
    onOpen?: (event: Event) => void;
    onError?: (event: Event) => void;
    onClose?: (event: CloseEvent) => void;
    onReconnect?: (event: Event) => void;
  }
) => {
  // FIXME: ちゃんとハンドリングする
  if (matchType == null || matchId == null) throw new Error("Unreachable");

  useWebSocket(
    `${import.meta.env.VITE_API_URL}/match/${matchType}/${matchId}/ws/view`,
    {
      ...optionListener,
      onMessage: (event) => {
        // FIXME: バリデーション
        const matchEvent = JSON.parse(event.data) as MatchEvent;
        onMatchEvent(matchEvent);
      },
    }
  );
};
