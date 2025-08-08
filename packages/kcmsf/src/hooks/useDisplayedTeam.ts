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
  displayedSide: [Side, Side];
  flip: () => void;
};

export const useDisplayedTeam = (
  matchInfo: MatchInfo | undefined,
  matchJudge: Judge
): UseDisplayedTeamReturnValue => {
  const [isFlipped, setFlipped] = useState(false);
  const flip = useCallback(() => setFlipped((prev) => !prev), []);

  const leftTeam = useMemo(
    (): DisplayedTeam => ({
      info: matchInfo?.teams.left,
      judge: matchJudge.leftTeam,
      goal: (goalTimeSec) => matchJudge.goalLeftTeam(goalTimeSec),
    }),
    [matchInfo, matchJudge]
  );
  const rightTeam = useMemo(
    (): DisplayedTeam => ({
      info: matchInfo?.teams.right,
      judge: matchJudge.rightTeam,
      goal: (goalTimeSec) => matchJudge.goalRightTeam(goalTimeSec),
    }),
    [matchInfo, matchJudge]
  );
  const teams = useMemo(
    (): [DisplayedTeam, DisplayedTeam] =>
      isFlipped ? [rightTeam, leftTeam] : [leftTeam, rightTeam],
    [isFlipped, rightTeam, leftTeam]
  );
  const displayedSide = useMemo(
    (): [Side, Side] => (isFlipped ? ["right", "left"] : ["left", "right"]),
    [isFlipped]
  );
  return { teams, isFlipped, displayedSide, flip };
};
