import { Match } from "../types/match";
type MatchResult = {
  teamID: string;
  points: number;
  goalTimeSeconds: number;
};
export const useMatchResult = (
  match: Match
): { team1Result: MatchResult; team2Result: MatchResult } => {
  //TODO: 本選ではwinnerIDを用いる
  console.log(match);
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
  //結果を作成
  const team1Result = {
    teamID: team1ID === undefined ? "" : team1ID,
    points: team1Point,
    goalTimeSeconds: team1GoalTime,
  };
  const team2Result = {
    teamID: team2ID === undefined ? "" : team2ID,
    points: team2Point,
    goalTimeSeconds: team2GoalTime,
  };
  return { team1Result, team2Result };
};
