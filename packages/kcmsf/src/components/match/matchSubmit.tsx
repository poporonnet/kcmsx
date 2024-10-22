import {
  Button,
  Flex,
  Modal,
  Paper,
  Text,
  useMantineTheme,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { IconAlertCircle, IconSend, IconSend2 } from "@tabler/icons-react";
import type { MatchInfo, MatchType } from "config";
type TeamResult = {
  id: string;
  points: number;
  time?: number;
  teamName: string;
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
  const [opened, { open, close }] = useDisclosure(false);

  return (
    <>
      <Button
        w="auto"
        h="auto"
        px="xl"
        py="sm"
        color="teal"
        disabled={!available}
        onClick={open}
      >
        <Flex gap="xs">
          <Text size="1.5rem">結果を送信</Text>
          <IconSend2 />
        </Flex>
      </Button>
      <MatchSubmitModal
        opened={opened}
        close={close}
        submit={submit}
        result={result}
        matchType={matchInfo.matchType}
      />
    </>
  );
};

const MatchSubmitModal = ({
  opened,
  close,
  submit,
  result,
  matchType,
}: {
  opened: boolean;
  close: () => void;
  submit: () => void;
  result: {
    left?: Omit<TeamResult, "id">;
    right?: Omit<TeamResult, "id">;
  };
  matchType: MatchType;
}) => {
  const handleSubmit = () => {
    submit();
    close();
  };
  const theme = useMantineTheme();
  return (
    <Modal opened={opened} onClose={close} title="試合結果送信確認" centered>
      <Flex direction="column" gap="md">
        <Text>
          以下のチームによる{matchType === "pre" ? "予選" : "本戦"}
          試合の結果を送信します
        </Text>
        <ul>
          {result.left?.teamName && <li>{result.left?.teamName}</li>}
          {result.right?.teamName && <li>{result.right?.teamName}</li>}
        </ul>
        <Paper c="red" fw={600} bg={theme.colors.red[0]} p="md" withBorder>
          <Flex direction="row" align="center" gap="sm">
            <IconAlertCircle size="1rem" />
            送信後はこの試合の結果を変更することはできません。
          </Flex>
        </Paper>
        <Button onClick={handleSubmit} leftSection={<IconSend />}>
          試合結果を送信
        </Button>
      </Flex>
    </Modal>
  );
};
