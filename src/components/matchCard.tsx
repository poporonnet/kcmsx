import { Card, SimpleGrid, Text } from "@mantine/core";
import { Link } from "react-router-dom";
interface MatchCardProps {
  id: string;
  matchType: "primary" | "final";
  category: "elementary" | "open";
  teams: {
    "right": {
      id: string;
      teamName: string;
      isMultiWalk: boolean;
    };
    "left": {
      id: string;
      teamName: string;
      isMultiWalk: boolean;
    };
  };
}

export const MatchCard = (props: MatchCardProps) => {
  return (
    <Link
      to={"/match/"}
      state={{
        id: props.id,
        teams: props.teams,
        matchType: props.matchType,
      }}
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
        <SimpleGrid
          cols={1}
          style={{
            color: "black",
            textAlign: "center",
            width: "100%",
            height: "100%",
          }}
        >
          <Text
            size={"1rem"}
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {props.teams["right"].teamName}
          </Text>
          <Text
            size={"1rem"}
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {props.teams["left"].teamName}
          </Text>
        </SimpleGrid>
      </Card>
    </Link>
  );
};
