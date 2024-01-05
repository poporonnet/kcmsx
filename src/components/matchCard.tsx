import { Card, SimpleGrid, Text } from "@mantine/core";
import { IconChecks } from "@tabler/icons-react";
import { LinkToMatch } from "./linkToMatch";
interface MatchCardProps {
  id: string;
  matchType: "primary" | "final";
  teams: {
    right: {
      id: string;
      teamName: string;
      isMultiWalk: boolean;
      category: "elementary" | "open";
    };
    left: {
      id: string;
      teamName: string;
      isMultiWalk: boolean;
      category: "elementary" | "open";
    };
  };
  isFinished: boolean;
}
export const MatchCard = (props: MatchCardProps) => {
  return (
    <LinkToMatch
      info={{
        id: props.id,
        teams: props.teams,
        matchType: props.matchType,
      }}
      style={{ pointerEvents: props.isFinished ? "none" : "auto" }}
    >
      <Card
        shadow={props.isFinished ? "none" : "sm"}
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
        {props.isFinished ? (
          <IconChecks
            size={30}
            color={"#00FF00"}
            style={{
              position: "absolute",
              top: "0.5rem",
              right: "0.5rem",
            }}
          />
        ) : (
          <></>
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
    </LinkToMatch>
  );
};
