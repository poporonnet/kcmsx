import { AppShell } from "@mantine/core";
import { Outlet } from "react-router-dom";
import { AuthProvider } from "../components/AuthProvider.tsx";
import { PrivateHeader } from "../components/PrivateHeader.tsx";

export const PrivateLayout = () => (
  <AuthProvider>
    <AppShell
      header={{ height: 60, offset: true }}
      footer={{ height: 30, offset: true }}
      padding="md"
    >
      <PrivateHeader />
      <AppShell.Main display="flex" style={{ flexDirection: "column" }}>
        <Outlet />
      </AppShell.Main>
      <AppShell.Footer>kcms &copy; 2023-2024 Poporon Network</AppShell.Footer>
    </AppShell>
  </AuthProvider>
);
