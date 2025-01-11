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
        fill: attributes.winnerID == attributes.team1ID ? "red" : "black",
        stroke: "red",
        strokeWidth: attributes.winnerID == attributes.team1ID ? 1 : 0,
        fontSize: `min(${(width / attributes.team1Name.length) * 0.9}px, 1rem)`,
      }}
    >
      {attributes.team1Name}
    </text>
    <text
      y={height / 4}
      textAnchor="middle"
      dominantBaseline="central"
      style={{
        fill: attributes.winnerID == attributes.team2ID ? "red" : "black",
        stroke: "red",
        strokeWidth: attributes.winnerID == attributes.team2ID ? 1 : 0,
        fontSize: `min(${(width / attributes.team2Name.length) * 0.9}px, 1rem)`,
      }}
    >
      {attributes.team2Name}
    </text>
  </g>
);
