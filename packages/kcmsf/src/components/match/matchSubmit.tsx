import { Button, Flex, Text } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { IconSend2 } from "@tabler/icons-react";
import { MatchInfo } from "config";

type TeamResult = {
  id: string;
  points: number;
  time?: number;
};

type APIPostRunResults = {
  teamID: string; // `teamId`でないことに注意
  points: number;
  goalTimeSeconds: number | null;
  finishState: "goal" | "finished";
}[];

export const MatchSubmit = (props: {
  matchInfo: MatchInfo;
  available: boolean;
  result: {
    left: Omit<TeamResult, "id">;
    right: Omit<TeamResult, "id">;
  };
}) => {
  const submit = async () => {
    const runResults: APIPostRunResults = [
      {
        teamID: props.matchInfo.teams.left.id,
        points: props.result.left.points,
        goalTimeSeconds: props.result.left.time ?? null,
        finishState: props.result.left.time != null ? "goal" : "finished",
      },
      {
        teamID: props.matchInfo.teams.right.id,
        points: props.result.right.points,
        goalTimeSeconds: props.result.right.time ?? null,
        finishState: props.result.right.time != null ? "goal" : "finished",
      },
    ];

    const result = await fetch(
      `${import.meta.env.VITE_API_URL}/match/${props.matchInfo.matchType}/${props.matchInfo.id}/run_result`,
      {
        method: "post",
        body: JSON.stringify(runResults),
        headers: {
          "Content-Type": "application/json",
        },
      }
    ).catch(() => undefined);

    notifications.show(
      result?.ok
        ? {
            title: "送信成功",
            message: "結果が正常に送信されました",
            color: "green",
          }
        : {
            title: "送信失敗",
            message: "結果の送信に失敗しました",
            color: "red",
          }
    );
  };

  return (
    <Button
      w="auto"
      h="auto"
      px="xl"
      py="sm"
      color="teal"
      disabled={!props.available}
      onClick={submit}
    >
      <Flex gap="xs">
        <Text size="1.5rem">結果を送信</Text>
        <IconSend2 />
      </Flex>
    </Button>
  );
};
