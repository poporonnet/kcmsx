import { config, MatchType } from "config";
import { useCallback, useState } from "react";
import { useTimer } from "react-timer-hook";
import { expiryTimestamp } from "../utils/time";

// FIXME: 型情報を適切な場所に置く
export type TimerState = "initial" | "counting" | "finished";

export const useMatchTimer = (
  matchType: MatchType
): {
  totalSeconds: number;
  isRunning: boolean;
  state: TimerState;
  switchTimer: () => void;
} => {
  const [timerState, setTimerState] = useState<TimerState>("initial");
  const { start, pause, resume, isRunning, totalSeconds } = useTimer({
    expiryTimestamp: expiryTimestamp(config.match[matchType].limitSeconds),
    autoStart: false,
    onExpire: () => setTimerState("finished"),
  });

  const switchTimer = useCallback(() => {
    if (timerState == "initial") {
      start();
      setTimerState("counting");
      return;
    }

    (isRunning ? pause : resume)();
  }, [timerState, setTimerState, start, pause, resume, isRunning]);

  return { totalSeconds, isRunning, state: timerState, switchTimer };
};
