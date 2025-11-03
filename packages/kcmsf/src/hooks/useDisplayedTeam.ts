import { MantineColor } from "@mantine/core";
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
  displayedCourseName: [string, string];
  displayedColor: [MantineColor, MantineColor];
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
  const displayedCourseName = useMemo(
    (): [string, string] =>
      isFlipped ? ["右コース", "左コース"] : ["左コース", "右コース"],
    [isFlipped]
  );
  const displayedColor = useMemo(
    (): [MantineColor, MantineColor] =>
      isFlipped ? ["red", "blue"] : ["blue", "red"],
    [isFlipped]
  );
  return { teams, isFlipped, displayedCourseName, displayedColor, flip };
};
