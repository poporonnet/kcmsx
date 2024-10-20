import { Button, Flex, Modal, Paper, useMantineTheme } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconAlertCircle, IconTablePlus } from "@tabler/icons-react";
import { LoaderButton } from "./LoaderButton";

export const GenerateMatchButton = ({
  generate,
  defaultOpened,
  disabled,
  modalTitle,
  modalDetail,
}: {
  generate: () => Promise<void>;
  defaultOpened?: boolean;
  disabled?: boolean;
  modalTitle?: string;
  modalDetail?: React.ReactNode;
}) => {
  const [opened, { open, close }] = useDisclosure(defaultOpened ?? false);
  const theme = useMantineTheme();

  return (
    <>
      <Modal opened={opened} onClose={close} title={modalTitle} centered>
        <Flex direction="column" gap="md">
          {modalDetail}

          <Paper c="red" fw={600} bg={theme.colors.red[0]} p="md" withBorder>
            <Flex direction="row" align="center" gap="sm">
              <IconAlertCircle size="3rem" />
              試合表を生成すると、以降はチーム登録やエントリーを変更できません。
              また、試合表を削除・再生成することもできません。
            </Flex>
          </Paper>
          <LoaderButton
            load={async () => {
              await generate();
              close();
            }}
            leftSection={<IconTablePlus />}
          >
            試合表を生成
          </LoaderButton>
        </Flex>
      </Modal>
      <Button
        onClick={open}
        leftSection={<IconTablePlus />}
        disabled={disabled}
      >
        試合表を生成
      </Button>
    </>
  );
};
