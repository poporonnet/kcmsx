import {
  Button,
  Flex,
  List,
  Modal,
  Paper,
  Text,
  useMantineTheme,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { IconAlertCircle, IconSend, IconSend2 } from "@tabler/icons-react";
import { config, type MatchInfo, type MatchType } from "config";
import { LoaderButton } from "../LoaderButton";
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
  submit: () => Promise<void>;
  result: {
    left?: Omit<TeamResult, "id">;
    right?: Omit<TeamResult, "id">;
  };
  matchType: MatchType;
}) => {
  const theme = useMantineTheme();
  return (
    <Modal opened={opened} onClose={close} title="走行結果送信確認" centered>
      <Flex direction="column" gap="md">
        <Text>
          以下のチームによる{config.match[matchType].name}
          試合の走行結果を送信します:
        </Text>
        <List>
          {result.left && <List.Item>{result.left.teamName}</List.Item>}
          {result.right && <List.Item>{result.right.teamName}</List.Item>}
        </List>
        <Paper c="red" fw={600} bg={theme.colors.red[0]} p="md" withBorder>
          <Flex direction="row" align="center" gap="sm">
            <IconAlertCircle size="3rem" />
            走行結果を送信すると、以降は削除したり変更したりすることができません。
          </Flex>
        </Paper>
        <LoaderButton
          load={async () => {
            await submit();
            close();
          }}
          leftSection={<IconSend />}
        >
          走行結果を送信
        </LoaderButton>
      </Flex>
    </Modal>
  );
};
