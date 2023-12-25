import { Card, SimpleGrid, Text } from "@mantine/core";
import { Link } from "react-router-dom";
import { IconChecks } from "@tabler/icons-react";
interface MatchCardProps {
  id: string;
  matchType: "primary" | "final";
  isEnd: boolean;
  category: "elementary" | "open";
  teams: [
    {
      id: string;
      teamName: string;
      isMultiWalk: boolean;
    },
    {
      id: string;
      teamName: string;
      isMultiWalk: boolean;
    },
  ];
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
          <Text
            size={"1rem"}
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {props.teams[0].teamName}
          </Text>
          <Text
            size={"1rem"}
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {props.teams[1].teamName}
          </Text>
        </SimpleGrid>
      </Card>
    </Link>
  );
};
