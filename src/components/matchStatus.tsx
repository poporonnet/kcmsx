import { Button, Text } from "@mantine/core";
import { TeamInfo } from "../pages/match";
import { LinkToMatch } from "./linkToMatch";
type StatusButtonProps = {
  id: string;
  teams: { right: TeamInfo; left: TeamInfo };
  status: "now" | "future" | "end";
  matchType: "primary" | "final";
};

export const MatchStatusButton = (props: StatusButtonProps) => {
  return (
    <LinkToMatch
      info={{
        id: props.id,
        teams: props.teams,
        matchType: props.matchType,
      }}
    >
      <Button
        variant="filled"
        color={
          props.status === "now"
            ? "green"
            : props.status === "end"
              ? "red"
              : "blue"
        }
        radius={"lg"}
        size="xs"
      >
        <Text fw={700}>
          {props.status === "now"
            ? "進行中"
            : props.status === "future"
              ? "未来"
              : "完了"}
        </Text>
      </Button>
    </LinkToMatch>
  );
};
