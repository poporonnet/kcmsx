import { MatchInfo } from "config";
import { useMemo } from "react";
import { Judge } from "../utils/match/judge";

export const useJudge = (matchInfo?: MatchInfo): Judge => {
  const judge = useMemo<Judge>(() => {
    return new Judge({}, {}, { matchInfo }, { matchInfo });
  }, [matchInfo]);

  return judge;
};
