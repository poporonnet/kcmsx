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

export const MatchSubmit = ({
  matchInfo,
  available,
  result,
}: {
  matchInfo: MatchInfo;
  available: boolean;
  result: {
    left?: Omit<TeamResult, "id">;
    right?: Omit<TeamResult, "id">;
  };
}) => {
  const submit = async () => {
    const runResults: APIPostRunResults = [];
    if (matchInfo.teams.left && result.left) {
      runResults.push({
        teamID: matchInfo.teams.left.id,
        points: result.left.points,
        goalTimeSeconds: result.left.time ?? null,
        finishState: result.left.time != null ? "goal" : "finished",
      });
    }
    if (matchInfo.teams.right && result.right) {
      runResults.push({
        teamID: matchInfo.teams.right.id,
        points: result.right.points,
        goalTimeSeconds: result.right.time ?? null,
        finishState: result.right.time != null ? "goal" : "finished",
      });
    }

    const res = await fetch(
      `${import.meta.env.VITE_API_URL}/match/${matchInfo.matchType}/${matchInfo.id}/run_result`,
      {
        method: "post",
        body: JSON.stringify(runResults),
        headers: {
          "Content-Type": "application/json",
        },
      }
    ).catch(() => undefined);

    notifications.show(
      res?.ok
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
      disabled={!available}
      onClick={submit}
    >
      <Flex gap="xs">
        <Text size="1.5rem">結果を送信</Text>
        <IconSend2 />
      </Flex>
    </Button>
  );
};
