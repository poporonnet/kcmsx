import { AppShell, rem } from "@mantine/core";
import { useHeadroom } from "@mantine/hooks";
import { Outlet } from "react-router-dom";
import { AuthProvider } from "../components/AuthProvider.tsx";
import { PrivateHeader } from "../components/PrivateHeader.tsx";

export const PrivateLayout = () => {
  const pinned = useHeadroom({ fixedAt: 60 });

  return (
    <AuthProvider>
      <AppShell
        header={{ height: 60, offset: false, collapsed: !pinned }}
        footer={{ height: 30, offset: true }}
        padding="md"
      >
        <PrivateHeader />
        <AppShell.Main
          display="flex"
          pt={`calc(${rem(60)} + var(--mantine-spacing-lg))`}
          style={{ flexDirection: "column" }}
        >
          <Outlet />
        </AppShell.Main>
        <AppShell.Footer>kcms &copy; 2023-2024 Poporon Network</AppShell.Footer>
      </AppShell>
    </AuthProvider>
  );
};
