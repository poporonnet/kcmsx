import { Card, SimpleGrid, Text } from "@mantine/core";
import { Link } from "react-router-dom";

interface MatchCardProps {
  id: number;
  teamName1: string;
  teamName2: string;
  matchType: string;
  isEnd: boolean;
}

export const MatchCard = (props: MatchCardProps) => {
  return (
    <Link
      to={"/match/"}
      state={{
        id: props.id,
        teamName1: props.teamName1,
        teamName2: props.teamName2,
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
        }}
      >
        <SimpleGrid
          cols={1}
          style={{
            color: "black",
          }}
        >
          <Text size={"2rem"}>{props.teamName1}</Text>
          <Text size={"2rem"}>{props.teamName2}</Text>
        </SimpleGrid>
      </Card>
    </Link>
  );
};
