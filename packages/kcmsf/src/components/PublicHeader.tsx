import { AppShell, Group, Title } from "@mantine/core";
import { RouterLink } from "./RouterLink";

export function PublicHeader() {
  return (
    <AppShell.Header>
      <Group h="100%" px="md">
        <Title>kcms</Title>
        <RouterLink to="/public/matchlist">試合表</RouterLink>
      </Group>
    </AppShell.Header>
  );
}
