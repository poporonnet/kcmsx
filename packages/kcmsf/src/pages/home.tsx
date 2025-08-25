import { NavLink, Stack, Title } from "@mantine/core";
import { RouterNavLink } from "../components/RouterNavLink";

export const Home = () => {
  return (
    <Stack gap="md">
      <Title m="md">Home</Title>
      <Stack gap={0} w="15rem">
        <NavLink label="チーム" color="dark" variant="subtle" defaultOpened>
          <HomeNavLink label="チーム一覧" to="/team" />
          <HomeNavLink label="チーム登録" to="/register" />
          <HomeNavLink label="チーム一括登録" to="/register/bulk" />
        </NavLink>
        <NavLink label="試合" color="dark" variant="subtle" defaultOpened>
          <HomeNavLink label="試合表" to="/matchlist" />
          <HomeNavLink label="本戦トーナメント表" to="/tournament" />
          <HomeNavLink label="エキシビション" to="/match" />
        </NavLink>
        <NavLink label="結果" color="dark" variant="subtle" defaultOpened>
          <HomeNavLink label="試合結果" to="/result" />
          <HomeNavLink label="ランキング" to="/ranking" />
        </NavLink>
      </Stack>
    </Stack>
  );
};

const HomeNavLink = ({ label, to }: { label: string; to: string }) => (
  <RouterNavLink label={label} to={to} c="indigo" active variant="subtle" />
);
