import { Card, SimpleGrid, Text } from "@mantine/core";
import { Link } from "react-router-dom";
import { IconChecks } from "@tabler/icons-react";

interface MatchCardProps {
  // 許して。後で直すから。
  id: string;
  team1: string;
  teamName1: string;
  team2: string;
  teamName2: string;
  matchType: string;
  isEnd: boolean;
  category: string;
  isMultiWalk: boolean;
}

export const MatchCard = (props: MatchCardProps) => {
  return (
    <Link
      to={"/match/"}
      state={{
        id: props.id,
        teams: [
          {
            id: props.team1,
            teamName: props.teamName1,
            category: props.category,
            isMultiWalk: props.isMultiWalk,
          },
          {
            id: props.team2,
            teamName: props.teamName2,
            category: props.category,
            isMultiWalk: props.isMultiWalk,
          },
        ],
        matchType: props.matchType,
      }}
      style={{ pointerEvents: props.isEnd ? "none" : "auto" }}
    >
      <Card
        shadow="sm"
        padding="sm"
        radius="md"
        m={"md"}
        withBorder
        variant={"outline"}
        style={{
          display: "flex",
          width: "15rem",
          height: "8rem",
          alignItems: "center",
        }}
      >
        {props.isEnd && (
          <IconChecks
            size={30}
            color={"#00FF00"}
            style={{
              position: "absolute",
              top: "0.5rem",
              right: "0.5rem",
            }}
          />
        )}
        <SimpleGrid
          cols={1}
          style={{
            color: "black",
            textAlign: "center",
            width: "100%",
            height: "100%",
          }}
        >
          <Text size={"1rem"} style={{display: "flex", justifyContent: "center", alignItems:"center"}}>{props.teamName1}</Text>
          <Text size={"1rem"} style={{display: "flex", justifyContent: "center", alignItems: "center"}}>{props.teamName2}</Text>
        </SimpleGrid>
      </Card>
    </Link>
  );
};
