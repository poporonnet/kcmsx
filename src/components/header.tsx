import { AppShell, Title, Group } from "@mantine/core";
import { Link } from "react-router-dom";

export function Header() {
  return (
    <AppShell.Header>
      <Group h="100%" px="md">
        <Title order={1}>kcms</Title>
        <Link to="/entrylist">参加者一覧</Link>
        <Link to="/entry">参加者登録</Link>
        <Link to="/matchlist">試合表</Link>
        <Link to="/result">試合結果</Link>
        <Link to="/ranking">ランキング</Link>
      </Group>
    </AppShell.Header>
  );
}
