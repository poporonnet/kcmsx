import { Button, Flex, Text } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { IconSend2 } from "@tabler/icons-react";
import { MatchInfo } from "config/types/derived/matchInfo";

type TeamResult = {
  id: string;
  points: number;
  time: number;
};

type MatchResult = {
  results: {
    left: TeamResult;
    right: TeamResult;
  };
};

export const MatchSubmit = (props: {
  matchInfo: MatchInfo;
  available: boolean;
  result: {
    left: Omit<TeamResult, "id">;
    right: Omit<TeamResult, "id">;
  };
}) => {
  const submit = async () => {
    const matchResult: MatchResult = {
      results: {
        left: {
          id: props.matchInfo.teams.left.id,
          ...props.result.left,
        },
        right: {
          id: props.matchInfo.teams.right.id,
          ...props.result.right,
        },
      },
    };

    return fetch(
      `${import.meta.env.VITE_API_URL}/match/${props.matchInfo.id}`,
      {
        method: "put",
        body: JSON.stringify(matchResult),
      }
    )
      .then(() =>
        notifications.show({
          title: "送信成功",
          message: "結果が正常に送信されました",
          color: "green",
        })
      )
      .catch(() =>
        notifications.show({
          title: "送信失敗",
          message: "結果の送信に失敗しました",
          color: "red",
        })
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
