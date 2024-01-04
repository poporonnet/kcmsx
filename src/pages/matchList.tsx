import { Box, Flex, Title } from "@mantine/core";
import { MatchCard } from "../components/matchCard.tsx";
import { useEffect, useState } from "react";
import { TeamInfo } from "./match.tsx";

// 考慮事項: 予選・決勝で同点の時のじゃんけんの入力をどうするか
type Match = {
  id: string;
  courseIndex: number;
  category: "elementary" | "open";
  teams: { right: TeamInfo; left: TeamInfo };
  matchType: "primary" | "final";
};

export const MatchList = () => {
  const [primaryMatches, setPrimaryMatches] = useState<
    Record<string, Match[]> | undefined
  >();
  const [finalMatches, setFinalMatches] = useState<
    Record<string, Match[]> | undefined
  >();
  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/match/primary`, { method: "GET" })
      .then((res) => res.json())
      .then((data) => {
        if (data.length === 0) return;
        const separatedData = data.reduce(
          (acc: Record<string, Match[]>, match: Match) => {
            const { courseIndex: coat } = match;
            if (!acc[coat]) {
              acc[coat] = [];
            }
            acc[coat].push(match);
            return acc;
          },
          {}
        );
        setPrimaryMatches(separatedData);
      });
  }, []);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/match/final`, { method: "GET" })
      .then((res) => res.json())
      .then((data) => {
        if (data.length === 0) return;
        const separatedData = data.reduce(
          (acc: Record<string, Match[]>, match: Match) => {
            const { courseIndex: coat } = match;
            if (!acc[coat]) {
              acc[coat] = [];
            }
            acc[coat].push(match);
            return acc;
          },
          {}
        );
        setFinalMatches(separatedData);
      });
  }, []);

  return (
    <Box style={{ width: "100%" }}>
      <Title order={2}>予選</Title>
      <Flex gap="xs">
        {primaryMatches ? (
          Object.entries(primaryMatches).map(([coat, matches]) => (
            <Flex
              direction="column"
              gap="sm"
              key={coat}
              style={{ backgroundColor: "#e0f0e0", borderRadius: "0.5rem" }}
            >
              <Title order={3}>{parseInt(coat) + 1}コート</Title>
              {matches.map((match) => {
                return (
                  <MatchCard
                    key={match.id}
                    id={match.id}
                    matchType={match.matchType}
                    teams={match.teams}
                  />
                );
              })}
            </Flex>
          ))
        ) : (
          <Title w={"100%"} order={3}>
            まだ予選の組み合わせは決まっていません
          </Title>
        )}
      </Flex>
      <Title order={2}>決勝</Title>
      <Flex gap="xs">
        {finalMatches ? (
          Object.entries(finalMatches).map(([coat, matches]) => (
            <Flex
              direction="column"
              gap="sm"
              key={coat}
              style={{ backgroundColor: "#e0f0e0", borderRadius: "0.5rem" }}
            >
              <Title order={3}>{parseInt(coat) + 1}コート</Title>
              {matches.map((match) => {
                return (
                  <MatchCard
                    key={match.id}
                    id={match.id}
                    matchType={match.matchType}
                    teams={match.teams}
                  />
                );
              })}
            </Flex>
          ))
        ) : (
          <Title w={"100%"} order={3}>
            まだ決勝戦の組み合わせは決まっていません
          </Title>
        )}
      </Flex>
    </Box>
  );
};
