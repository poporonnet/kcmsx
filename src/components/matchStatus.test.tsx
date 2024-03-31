import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import { TeamInfo } from "../pages/match";
import { MatchStatusButton } from "./matchStatus";

describe("matchStatus", () => {
  const teams: { right: TeamInfo; left: TeamInfo } = {
    right: {
      id: "8dc17049-38f5-42b7-8489-f77cc72fe9f5",
      teamName: "チーム3",
      isMultiWalk: true,
      category: "open",
    },
    left: {
      id: "6d69ad85-ac39-468f-8d06-532fa117cf04",
      teamName: "チーム1",
      isMultiWalk: true,
      category: "open",
    },
  };


  test("should render match status", () => {
    render(
      <MatchStatusButton
        id={"38295"}
        status="end"
        matchType="primary"
        teams={teams}
      />
    );
    expect(screen.getByText('完了')).toBeInTheDocument();
  });
});
