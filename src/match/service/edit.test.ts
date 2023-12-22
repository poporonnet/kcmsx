import { describe, expect, it } from "vitest";
import { DummyMatchRepository } from "../adaptor/dummyRepository.js";
import { EditMatchService } from "./edit.js";
import { Match } from "../match.js";
import { Entry } from "../../entry/entry.js";
import { Result } from "@mikuroxina/mini-fn";

describe("EditMatch", () => {
  const reporitory = new DummyMatchRepository();
  reporitory.create(
    Match.reconstruct({
      id: "123",
      teams: [
        Entry.new({
          id: "101",
          teamName: "BBC",
          members: ["test1", "test2"],
          isMultiWalk: false,
          category: "Elementary",
        }),
        Entry.new({
          id: "100",
          teamName: "ABC",
          members: ["test1"],
          isMultiWalk: false,
          category: "Open",
        }),
      ],
      matchType: "primary",
      courseIndex: 0,
    }),
  );
  const editService = new EditMatchService(reporitory);

  it("正しく更新できる", async () => {
    const res = await editService.handle("123", {
      points: [
        {
          teamID: "101",
          points: 2,
        },
        {
          teamID: "100",
          points: 3,
        },
      ],
      time: [200, 100],
      winnerID: "100",
    });

    expect(Result.isErr(res)).toBe(false);
    if (Result.isErr(res)) return;
    expect(res[1].time).toStrictEqual([200, 100]);
    expect(res[1].winnerID).toStrictEqual("100");
    expect(res[1].points).toStrictEqual([
      {
        teamID: "101",
        points: 2,
      },
      {
        teamID: "100",
        points: 3,
      },
    ]);
  });
});
