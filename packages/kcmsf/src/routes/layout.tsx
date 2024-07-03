import { AppShell } from "@mantine/core";
import { Outlet } from "react-router-dom";
import { Header } from "../components/header.tsx";

export const Layout = () => (
  <AppShell
    header={{ height: 60, offset: true }}
    footer={{ height: 30, offset: true }}
    padding="md"
  >
    <Header />
    <AppShell.Main>
      <Outlet />
    </AppShell.Main>
    <AppShell.Footer>kcms &copy; Poporon Network 2023</AppShell.Footer>
  </AppShell>
);
