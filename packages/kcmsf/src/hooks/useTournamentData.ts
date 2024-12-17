import { useCallback, useMemo } from "react";
import { Tournament, TournamentNode } from "../types/tournament";
import { TournamentData } from "../types/tournamentData";

export const useTournamentData = (tournament: Tournament): TournamentData => {
  const convertTournamentData = useCallback(
    (node: TournamentNode): TournamentData => {
      const previousNode1 =
        node.type == "match"
          ? convertTournamentData(node.previousNode1)
          : undefined;
      const previousNode2 =
        node.type == "match"
          ? convertTournamentData(node.previousNode2)
          : undefined;
      const getRootTeamName = ({ attributes }: TournamentData): string =>
        attributes.type == "match"
          ? attributes.winnerID == attributes.team1ID
            ? attributes.team1Name
            : attributes.team2Name
          : attributes.teamName;

      const previousNode1TeamName = previousNode1
        ? getRootTeamName(previousNode1)
        : "";
      const previousNode2TeamName = previousNode2
        ? getRootTeamName(previousNode2)
        : "";

      return {
        name: node.type == "match" ? node.matchID : node.teamID,
        attributes:
          node.type == "match"
            ? {
                type: "match",
                matchID: node.matchID,
                matchCode: node.matchCode,
                team1ID: node.team1ID,
                team1Name: previousNode1TeamName,
                team2ID: node.team2ID,
                team2Name: previousNode2TeamName,
                winnerID: node.winnerID,
              }
            : {
                type: "team",
                teamID: node.teamID,
                teamName: node.teamName,
              },
        children:
          node.type == "match" && previousNode1 && previousNode2
            ? [previousNode1, previousNode2]
            : undefined,
      };
    },
    []
  );

  const tournamentData = useMemo(
    () => convertTournamentData(tournament),
    [tournament, convertTournamentData]
  );

  return tournamentData;
};
