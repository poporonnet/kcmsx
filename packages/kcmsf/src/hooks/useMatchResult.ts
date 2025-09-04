import { useCallback, useMemo } from "react";
import { Match } from "../types/match";

type MatchResult = {
  teamID: string;
  points: number;
  goalTimeSeconds: number;
};

type UseMatchResult = {
  team1Result: MatchResult | undefined;
  team2Result: MatchResult | undefined;
};

export const useMatchResult = (match: Match): UseMatchResult => {
  const getResult = useCallback(
    (teamID: string): MatchResult => {
      const runResults = match.runResults.filter(
        (result) => result.teamID === teamID
      );
      const points = runResults.reduce((sum, result) => sum + result.points, 0);
      const goalTimeSeconds = runResults.reduce((min, result) => {
        const goalTime = result.goalTimeSeconds ?? Infinity;
        return goalTime < min ? goalTime : min;
      }, Infinity);

      return { teamID, points, goalTimeSeconds };
    },
    [match]
  );

  return useMemo((): UseMatchResult => {
    const team1ID =
      match.matchType === "pre" ? match.leftTeam?.id : match.team1?.id;
    const team2ID =
      match.matchType === "pre" ? match.rightTeam?.id : match.team2?.id;

    return {
      team1Result: team1ID ? getResult(team1ID) : undefined,
      team2Result: team2ID ? getResult(team2ID) : undefined,
    };
  }, [match, getResult]);
};
