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
      teams: {
        left: Entry.new({
          id: "101",
          teamName: "BBC",
          members: ["test1", "test2"],
          isMultiWalk: false,
          category: "Elementary",
        }),
        right: Entry.new({
          id: "100",
          teamName: "ABC",
          members: ["test1"],
          isMultiWalk: false,
          category: "Open",
        }),
      },
      matchType: "primary",
      courseIndex: 0,
    }),
  );
  const editService = new EditMatchService(reporitory);

  it("正しく更新できる", async () => {
    const res = await editService.handle("123", {
      results: {
        left: {
          teamID: "101",
          points: 2,
          time: 100,
        },
        right: {
          teamID: "100",
          points: 3,
          time: 200,
        },
      },
    });

    expect(Result.isErr(res)).toBe(false);
    if (Result.isErr(res)) return;
    expect(res[1].results).toStrictEqual({
      left: {
        teamID: "101",
        points: 2,
        time: 100,
      },
      right: {
        teamID: "100",
        points: 3,
        time: 200,
      },
    });
  });
});
