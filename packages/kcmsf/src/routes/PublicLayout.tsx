import { Anchor, AppShell, rem } from "@mantine/core";
import { useHeadroom } from "@mantine/hooks";
import { Outlet } from "react-router-dom";
import { PublicHeader } from "../components/PublicHeader.tsx";

export const PublicLayout = () => {
  const pinned = useHeadroom({ fixedAt: 60 });

  return (
    <AppShell
      header={{ height: 60, offset: false, collapsed: !pinned }}
      footer={{ height: 30, offset: true }}
      padding="md"
    >
      <PublicHeader />
      <AppShell.Main
        display="flex"
        pt={`calc(${rem(60)} + var(--mantine-spacing-lg))`}
        style={{ flexDirection: "column" }}
      >
        <Outlet />
      </AppShell.Main>
      <AppShell.Footer>
        kcms &copy; 2023-2025{" "}
        <Anchor
          href="https://poporon.org"
          target="_blank"
          c="black"
          underline="not-hover"
        >
          Poporon Network
        </Anchor>
      </AppShell.Footer>
    </AppShell>
  );
};
