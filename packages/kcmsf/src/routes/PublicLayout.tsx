import { AppShell } from "@mantine/core";
import { Outlet } from "react-router-dom";
import { PublicHeader } from "../components/PublicHeader.tsx";

export const PublicLayout = () => (
  <AppShell
    header={{ height: 60, offset: true }}
    footer={{ height: 30, offset: true }}
    padding="md"
  >
    <PublicHeader />
    <AppShell.Main display="flex" style={{ flexDirection: "column" }}>
      <Outlet />
    </AppShell.Main>
    <AppShell.Footer>kcms &copy; 2023-2024 Poporon Network</AppShell.Footer>
  </AppShell>
);
