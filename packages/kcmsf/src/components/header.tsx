import { AppShell, Group, Title } from "@mantine/core";
import { Link } from "react-router-dom";

export function Header() {
  return (
    <AppShell.Header>
      <Group h="100%" px="md">
        <Link to="/" style={{ color: "black" }}>
          <Title>kcms</Title>
        </Link>
        <Link to="/team">参加者一覧</Link>
        <Link to="/register">参加者登録</Link>
        <Link to="/register/bulk">参加者一括登録</Link>
        <Link to="/matchlist">試合表</Link>
        <Link to="/result">試合結果</Link>
        <Link to="/ranking">ランキング</Link>
        <Link to="/match">エキシビション</Link>
      </Group>
    </AppShell.Header>
  );
}
