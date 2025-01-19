import { MatchInfo, MatchType, TeamInfo } from "config";
import { useCallback, useEffect, useState } from "react";
import { GetMatchResponse } from "../types/api/match";
import { GetTeamResponse } from "../types/api/team";
import { Match } from "../types/match";

export const useMatchInfo = (
  id?: string,
  matchType?: MatchType
): { match?: Match; matchInfo?: MatchInfo; refetch: () => Promise<void> } => {
  const [match, setMatch] = useState<Match>();
  const [matchInfo, setMatchInfo] = useState<MatchInfo>();

  const fetchTeam = useCallback(
    async (teamID: string): Promise<GetTeamResponse> => {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/team/${teamID}`,
        { method: "GET", credentials: "include" }
      );
      return (await res.json()) as GetTeamResponse;
    },
    []
  );

  const fetchMatchInfo = useCallback(async () => {
    if (!id || !matchType) return;

    const res = await fetch(
      `${import.meta.env.VITE_API_URL}/match/${matchType}/${id}`,
      { method: "GET", credentials: "include" }
    );
    if (!res.ok) return;

    const matchRes = (await res.json()) as GetMatchResponse;

    const isMainSecondMatch =
      matchRes.matchType == "main" && matchRes.runResults.length >= 2;

    const leftTeamID =
      matchRes.matchType == "main" ? matchRes.team1?.id : matchRes.leftTeam?.id;
    const leftTeam = leftTeamID ? await fetchTeam(leftTeamID) : undefined;

    const rightTeamID =
      matchRes.matchType == "main"
        ? matchRes.team2?.id
        : matchRes.rightTeam?.id;
    const rightTeam = rightTeamID ? await fetchTeam(rightTeamID) : undefined;

    const leftTeamInfo: TeamInfo | undefined = leftTeam
      ? {
          id: leftTeam.id,
          teamName: leftTeam.name,
          robotType: leftTeam.robotType,
          departmentType: leftTeam.departmentType,
        }
      : undefined;

    const rightTeamInfo: TeamInfo | undefined = rightTeam
      ? {
          id: rightTeam.id,
          teamName: rightTeam.name,
          robotType: rightTeam.robotType,
          departmentType: rightTeam.departmentType,
        }
      : undefined;

    const matchInfo: MatchInfo = {
      id: matchRes.id,
      matchType,
      teams: isMainSecondMatch
        ? {
            // 本戦試合2回目のみ左右を入れ替える
            left: rightTeamInfo,
            right: leftTeamInfo,
          }
        : {
            left: leftTeamInfo,
            right: rightTeamInfo,
          },
    };

    setMatch(matchRes);
    setMatchInfo(matchInfo);
  }, [id, matchType, fetchTeam]);

  useEffect(() => {
    fetchMatchInfo();
  }, [fetchMatchInfo]);

  return { match, matchInfo, refetch: fetchMatchInfo };
};
