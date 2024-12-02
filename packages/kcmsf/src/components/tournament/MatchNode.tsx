import { TournamentAttributes } from "../../types/tournamentData";
import styles from "./tournament.module.css";

export const MatchNode = ({
  width,
  height,
  attributes,
  onClick,
}: {
  width: number;
  height: number;
  attributes: TournamentAttributes<"match">;
  onClick?: () => void;
}) => (
  <g className={styles["node-match"]} onClick={onClick}>
    <rect
      x={-width / 2}
      y={-height / 2}
      style={{
        width,
        height,
        stroke: "black",
        strokeWidth: 1,
      }}
    />
    <text
      y={-height / 4}
      textAnchor="middle"
      dominantBaseline="central"
      style={{ fill: "#4c6ef5", strokeWidth: 0 }}
    >
      {attributes.matchCode}
    </text>
    <text
      textAnchor="middle"
      dominantBaseline="central"
      style={{
        fill: attributes.winnerId == attributes.team1Id ? "red" : "black",
        stroke: "red",
        strokeWidth: attributes.winnerId == attributes.team1Id ? 1 : 0,
      }}
    >
      {attributes.team1Name}
    </text>
    <text
      y={height / 4}
      textAnchor="middle"
      dominantBaseline="central"
      style={{
        fill: attributes.winnerId == attributes.team2Id ? "red" : "black",
        stroke: "red",
        strokeWidth: attributes.winnerId == attributes.team2Id ? 1 : 0,
      }}
    >
      {attributes.team2Name}
    </text>
  </g>
);