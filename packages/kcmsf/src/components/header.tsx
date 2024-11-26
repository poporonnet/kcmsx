import { AppShell, Group, Title } from "@mantine/core";
import { RouterLink } from "./RouterLink";

export function Header() {
  return (
    <AppShell.Header>
      <Group h="100%" px="md">
        <RouterLink to="/" c="black">
          <Title>kcms</Title>
        </RouterLink>
        <RouterLink to="/team">参加者一覧</RouterLink>
        <RouterLink to="/team">参加者一覧</RouterLink>
        <RouterLink to="/register">参加者登録</RouterLink>
        <RouterLink to="/register/bulk">一括登録</RouterLink>
        <RouterLink to="/matchlist">試合表</RouterLink>
        <RouterLink to="/result">試合結果</RouterLink>
        <RouterLink to="/ranking">ランキング</RouterLink>
        <RouterLink to="/match">エキシビション</RouterLink>
      </Group>
    </AppShell.Header>
  );
}
