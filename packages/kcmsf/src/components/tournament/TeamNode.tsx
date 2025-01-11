import { TournamentAttributes } from "../../types/tournamentData";

export const TeamNode = ({
  width,
  height,
  attributes,
}: {
  width: number;
  height: number;
  attributes: TournamentAttributes<"team">;
}) => (
  <g>
    <rect
      x={-width / 2}
      y={-height / 2}
      style={{
        width,
        height,
        fill: "whitesmoke",
        stroke: "black",
      }}
    />
    <text
      textAnchor="middle"
      dominantBaseline="central"
      style={{ fill: "black", strokeWidth: 0, fontSize: "0.75rem" }}
    >
      {attributes.teamName}
    </text>
  </g>
);
