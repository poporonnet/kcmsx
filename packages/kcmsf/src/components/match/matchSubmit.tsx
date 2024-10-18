import { Button, Flex, Modal, Text } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { IconSend, IconSend2 } from "@tabler/icons-react";
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
      <MatchSubmitModal opened={opened} close={close} submit={submit} />
    </>
  );
};

const MatchSubmitModal = ({
  opened,
  close,
  submit,
}: {
  opened: boolean;
  close: () => void;
  submit: () => void;
}) => {
  const handleSubmit = () => {
    submit();
    close();
  };
  return (
    <Modal opened={opened} onClose={close} title="試合結果送信確認" centered>
      <Flex direction="column" gap="md">
        <Text>この試合の結果を送信しますか?</Text>
        <Button onClick={handleSubmit} leftSection={<IconSend />}>
          試合結果を送信
        </Button>
      </Flex>
    </Modal>
  );
};
