import { useEffect, useState } from "react";
import { Match } from "../types/match";
type MatchResult = {
  teamID: string;
  points: number;
  goalTimeSeconds: number;
};
export const useMatchResult = (
  match: Match
): {
  team1Result: MatchResult | undefined;
  team2Result: MatchResult | undefined;
} => {
  const [team1Result, setTeam1Result] = useState<MatchResult>();
  const [team2Result, setTeam2Result] = useState<MatchResult>();

  //TODO: 本選ではwinnerIDを用いる
  useEffect(() => {
    const team1ID =
      match.matchType === "pre" ? match.leftTeam?.id : match.team1.id;
    const team2ID =
      match.matchType === "pre" ? match.rightTeam?.id : match.team2.id;

    const team1Results = match.runResults.filter(
      (result) => result.teamID === team1ID
    );
    const team2Results = match.runResults.filter(
      (result) => result.teamID === team2ID
    );

    const team1Point = team1Results.reduce(
      (sum, result) => sum + result.points,
      0
    );
    const team2Point = team2Results.reduce(
      (sum, result) => sum + result.points,
      0
    );

    const team1GoalTime = team1Results.reduce((min, result) => {
      const goalTime = result.goalTimeSeconds ?? Infinity;
      return goalTime < min ? goalTime : min;
    }, Infinity);

    const team2GoalTime = team2Results.reduce((min, result) => {
      const goalTime = result.goalTimeSeconds ?? Infinity;
      return goalTime < min ? goalTime : min;
    }, Infinity);
    if (team1ID !== undefined) {
      setTeam1Result({
        teamID: team1ID,
        points: team1Point,
        goalTimeSeconds: team1GoalTime,
      });
    }
    if (team2ID !== undefined) {
      setTeam2Result({
        teamID: team2ID,
        points: team2Point,
        goalTimeSeconds: team2GoalTime,
      });
    }
  }, [match]);

  return { team1Result, team2Result };
};
