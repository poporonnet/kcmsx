import { Outlet } from "react-router-dom";
import { Header } from "../components/header.tsx";
import { AppShell } from "@mantine/core";

export const Layout = () => (
  <>
    <AppShell header={{ height: 60 }} padding="md">
      <Header />
      <Outlet />
    </AppShell>
  </>
);
