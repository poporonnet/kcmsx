import {
  Button,
  LoadingOverlay,
  Paper,
  PasswordInput,
  Space,
  Stack,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconLogin } from "@tabler/icons-react";
import { useCallback, useState } from "react";

export const Login = ({
  auth,
  login,
}: {
  auth: boolean | undefined;
  login: (username: string, password: string) => Promise<boolean>;
}) => {
  const [loading, { open: startLoad, close: finishLoad }] = useDisclosure();
  const [failed, setFailed] = useState<boolean>();
  const onSubmit = useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      const username = event?.currentTarget.elements.namedItem("username");
      const password = event?.currentTarget.elements.namedItem(
        "password"
      ) as HTMLInputElement;
      if (
        username instanceof HTMLInputElement &&
        password instanceof HTMLInputElement
      ) {
        startLoad();
        setFailed(undefined);

        const res = await login(username.value, password.value);

        finishLoad();
        setFailed(!res);
      }
    },
    [login, startLoad, finishLoad]
  );

  return (
    <Stack
      w="100dvw"
      miw="20rem"
      h="100dvh"
      align="center"
      justify="center"
      bg="gray.1"
      style={{ boxSizing: "border-box" }}
      px="xl"
    >
      <Paper shadow="sm" radius="md" p="xl" w="100%" maw="25rem" pos="relative">
        <LoadingOverlay
          overlayProps={{ radius: "md", blur: 1.5 }}
          visible={auth == null}
        />
        <Title>kcmsx login</Title>
        <Space h="md" />
        <form onSubmit={onSubmit}>
          <Stack ta="left" gap="xs">
            <TextInput
              name="username"
              label="ユーザ名"
              description="username"
              placeholder="ユーザ名を入力"
            />
            <PasswordInput
              name="password"
              label="パスワード"
              description="password"
              placeholder="パスワードを入力"
            />
            <Text c="red" ta="center" h="lg">
              {failed && "ログインに失敗しました"}
            </Text>
            <Button
              type="submit"
              loading={loading}
              loaderProps={{ type: "dots" }}
              leftSection={<IconLogin />}
            >
              ログイン
            </Button>
          </Stack>
        </form>
      </Paper>
    </Stack>
  );
};
