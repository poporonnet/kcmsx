import { Flex } from "@mantine/core";
import { useMemo } from "react";
import { Tree } from "react-d3-tree";
import { useCenterTranslate } from "../../hooks/useCenterTranslate";
import { useTournamentData } from "../../hooks/useTournamentData";
import { Tournament } from "../../types/tournament";
import { TournamentData } from "../../types/tournamentData";
import { MatchNode } from "./MatchNode";
import { TeamNode } from "./TeamNode";
import styles from "./tournament.module.css";
import "./tournamentContainer.css";

export const TournamentBracket = ({
  tournament,
  onClickNode,
}: {
  tournament: Tournament;
  onClickNode?: (node: TournamentData) => void;
}) => {
  const data = useTournamentData(tournament);
  const matchNodeRect = useMemo(() => ({ x: 140, y: 80 }), []);
  const teamNodeRect = useMemo(() => ({ x: 100, y: 40 }), []);
  const { containerRef, setTargetClassName, translate } = useCenterTranslate({
    offset: { y: matchNodeRect.y / 2 },
  });

  return (
    <Flex w="80dvw" flex={1} bg="whitesmoke" ref={containerRef}>
      <Tree
        translate={translate}
        data={data}
        renderCustomNodeElement={(props) => {
          const data = props.nodeDatum as unknown as TournamentData;

          return data.attributes.type == "match" ? (
            <MatchNode
              width={matchNodeRect.x}
              height={matchNodeRect.y}
              attributes={data.attributes}
              onClick={() => onClickNode?.(data)}
            />
          ) : (
            <TeamNode
              width={teamNodeRect.x}
              height={teamNodeRect.y}
              attributes={data.attributes}
            />
          );
        }}
        scaleExtent={{
          min: 0,
          max: Infinity,
        }}
        ref={(ref) => setTargetClassName(ref?.gInstanceRef)}
        nodeSize={{ x: matchNodeRect.x, y: matchNodeRect.y }}
        pathFunc="step"
        pathClassFunc={(props) => {
          const from = props.target.data as unknown as TournamentData;
          const to = props.source.data as unknown as TournamentData<"match">;
          const teams =
            from.attributes.type == "match"
              ? [from.attributes.team1ID, from.attributes.team2ID]
              : [from.name];
          const winnerID = to.attributes.winnerID ?? "";
          return teams.includes(winnerID)
            ? styles["path-winner"]
            : styles["path"];
        }}
        collapsible={false}
        separation={{ siblings: 1, nonSiblings: 0.9 }}
        orientation="vertical"
        zoomable={true}
        draggable={true}
        depthFactor={140}
      />
    </Flex>
  );
};
