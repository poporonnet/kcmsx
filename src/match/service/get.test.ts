import { describe, it, expect } from "vitest";
import { DummyMatchRepository } from "../adaptor/dummyRepository.js";
import { Entry } from "../../entry/entry.js";
import { Match } from "../match.js";
import { GetMatchService } from "./get.js";
import { Result } from "@mikuroxina/mini-fn";

describe("GetMatchService", () => {
  const repository = new DummyMatchRepository();
  const entry = Entry.new({
    id: crypto.randomUUID(),
    teamName: "チームA",
    members: ["メンバーA"],
    isMultiWalk: true,
    category: "Open",
  });
  const match = Match.reconstruct({
    id: "111",
    teams: [entry, undefined],
    matchType: "primary",
    courseIndex: 0,
  });
  repository.create(match);
  const service = new GetMatchService(repository);

  it("取得できる", async () => {
    const res = await service.findById("111");

    expect(Result.isErr(res)).toStrictEqual(false);
    expect(res[1]).toStrictEqual(match);
  });

  it("存在しないときはエラー", async () => {
    const res = await service.findById("222");

    expect(Result.isErr(res)).toStrictEqual(true);
    expect(res[1]).toStrictEqual(new Error("Not found"));
  });
});
