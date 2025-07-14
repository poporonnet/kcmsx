import { MatchInfo } from "config";
import { Side } from "config/src/types/matchInfo";
import { useCallback, useMemo, useState } from "react";
import { Judge } from "../utils/match/judge";
import { Team } from "../utils/match/team";

type DisplayedTeam = {
  info: MatchInfo["teams"][Side];
  judge: Team;
  goal: Judge["goalLeftTeam" | "goalRightTeam"];
};

type UseDisplayedTeamReturnValue = {
  teams: [DisplayedTeam, DisplayedTeam];
  isFlipped: boolean;
  flip: () => void;
};

export const useDisplayedTeam = (
  matchInfo: MatchInfo | undefined,
  matchJudge: Judge
): UseDisplayedTeamReturnValue => {
  const [isFlipped, setFlipped] = useState(false);
  const flip = useCallback(() => setFlipped((prev) => !prev), []);

  const teams = useMemo((): [DisplayedTeam, DisplayedTeam] => {
    const left: DisplayedTeam = {
      info: matchInfo?.teams.left,
      judge: matchJudge.leftTeam,
      goal: (goalTimeSec) => matchJudge.goalLeftTeam(goalTimeSec),
    };
    const right: DisplayedTeam = {
      info: matchInfo?.teams.right,
      judge: matchJudge.rightTeam,
      goal: (goalTimeSec) => matchJudge.goalRightTeam(goalTimeSec),
    };
    return isFlipped ? [right, left] : [left, right];
  }, [matchInfo, matchJudge, isFlipped]);

  return { teams, isFlipped, flip };
};
