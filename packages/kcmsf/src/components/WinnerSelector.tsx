import { Divider, Flex, Group, Paper, Radio, Stack, Text } from "@mantine/core";
import { IconSend } from "@tabler/icons-react";
import { useState } from "react";
import { BriefTeam } from "../types/match";
import { LoaderButton } from "./LoaderButton";

export const WinnerSelector = ({
  team1,
  team2,
  onSelect,
}: {
  team1: BriefTeam;
  team2: BriefTeam;
  onSelect: (winnerID: string) => Promise<void>;
}) => {
  const [winnerID, setWinnerID] = useState<string>();

  return (
    <Paper w="100%" p="md" withBorder>
      <Stack w="100%" align="center" justify="center" gap={0}>
        <Text fw="bold">
          同点・同ベストタイムのため勝敗を決定できません。
          <br />
          勝利チームを選択してください。
        </Text>
        <Radio.Group w="100%" value={winnerID} onChange={setWinnerID} my="xl">
          <Group gap="xl" w="100%" align="center">
            <Flex flex={1} justify="center">
              <Radio
                value={team1.id}
                label={team1.teamName}
                size="lg"
                c="blue"
                px="lg"
              />
            </Flex>
            <Divider orientation="vertical" />
            <Flex flex={1} justify="center">
              <Radio
                value={team2.id}
                label={team2.teamName}
                size="lg"
                c="red"
                px="lg"
                color="red"
              />
            </Flex>
          </Group>
        </Radio.Group>
        <Text c="red" fw="bold" mb="xs">
          勝利チームを決定すると、以降は変更できません。
        </Text>
        <LoaderButton
          load={async () => {
            if (winnerID) await onSelect(winnerID);
          }}
          leftSection={<IconSend />}
          disabled={!winnerID}
        >
          勝利チームを決定
        </LoaderButton>
      </Stack>
    </Paper>
  );
};
