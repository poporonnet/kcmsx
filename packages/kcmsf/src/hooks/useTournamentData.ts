import { useCallback, useMemo } from "react";
import { Tournament, TournamentNode } from "../types/tournament";
import { TournamentData } from "../types/tournamentData";

export const useTournamentData = (
  tournament?: Tournament
): TournamentData | undefined => {
  const convertTournamentData = useCallback(
    (node: TournamentNode): TournamentData => {
      const previousNode1 = node.childMatch1
        ? convertTournamentData(node.childMatch1)
        : undefined;
      const previousNode2 = node.childMatch2
        ? convertTournamentData(node.childMatch2)
        : undefined;
      const getRootTeamName = ({ attributes }: TournamentData): string => {
        if (attributes.type == "team") return attributes.teamName;
        if (!attributes.winnerID) return "";

        return attributes.winnerID == attributes.team1ID
          ? attributes.team1Name
          : attributes.team2Name;
      };
      const getTeamNode = (team: (typeof node)["team1"]): TournamentData => ({
        name: team?.id ?? "",
        attributes: {
          type: "team",
          teamID: team?.id ?? "",
          teamName: team?.teamName ?? "",
        },
      });

      const previousNode1TeamName = previousNode1
        ? getRootTeamName(previousNode1)
        : (node.team1?.teamName ?? "");
      const previousNode2TeamName = previousNode2
        ? getRootTeamName(previousNode2)
        : (node.team2?.teamName ?? "");

      return {
        name: node.id,
        attributes: {
          type: "match",
          matchID: node.id,
          matchCode: node.matchCode,
          team1ID: node.team1?.id ?? "",
          team1Name: previousNode1TeamName,
          team2ID: node.team2?.id ?? "",
          team2Name: previousNode2TeamName,
          winnerID: node.winnerID,
        },
        children:
          previousNode1 && previousNode2
            ? [previousNode1, previousNode2]
            : [getTeamNode(node.team1), getTeamNode(node.team2)],
      };
    },
    []
  );

  const tournamentData = useMemo(
    () => tournament && convertTournamentData(tournament),
    [tournament, convertTournamentData]
  );

  return tournamentData;
};
