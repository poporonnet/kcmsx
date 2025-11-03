import { AppShell } from "@mantine/core";
import "@testing-library/jest-dom";
import { screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import { render } from "../../test/index.ts";
import { PrivateHeader } from "./PrivateHeader.tsx";

describe("header component", () => {
  test("has /entrylist link", () => {
    render(
      <AppShell
        header={{ height: 60, offset: true }}
        footer={{ height: 30, offset: true }}
        padding="md"
      >
        <PrivateHeader />
      </AppShell>
    );

    expect(screen.getByText("チーム一覧")).toHaveAttribute("href", "/team");
    expect(screen.getByText("チーム登録")).toHaveAttribute("href", "/register");
    expect(screen.getByText("一括登録")).toHaveAttribute(
      "href",
      "/register/bulk"
    );
    expect(screen.getByText("試合表")).toHaveAttribute("href", "/matchlist");
    expect(screen.getByText("試合結果")).toHaveAttribute("href", "/result");
    expect(screen.getByText("ランキング")).toHaveAttribute("href", "/ranking");
    expect(screen.getByText("エキシビション")).toHaveAttribute(
      "href",
      "/match"
    );
  });
});
