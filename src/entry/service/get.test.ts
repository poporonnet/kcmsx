import { describe, it, expect } from "vitest";
import { DummyRepository } from "../adaptor/dummyRepository.js";
import { EntryDTO, FindEntryService } from "./get.js";
import { Entry, EntryCreateArgs } from "../entry.js";
import { Result } from "@mikuroxina/mini-fn";

describe("getEntryService", () => {
  const repository = new DummyRepository();
  const service = new FindEntryService(repository);

  const dummyData: Array<EntryCreateArgs> = [
    {
      id: "123",
      teamName: "team1",
      members: ["山田四十郎"],
      isMultiWalk: true,
      category: "Open",
    },
    {
      id: "456",
      teamName: "team2",
      members: ["今田美希"],
      isMultiWalk: false,
      category: "Elementary",
    },
  ];
  const testEntryData = dummyData.map((d) => Entry.new(d));

  it("すべて取得できる", async () => {
    testEntryData.map((d) => repository.create(d));
    const actual = await service.findAll();

    expect(Result.isOk(actual)).toBe(true);
    expect(actual[1]).toStrictEqual(
      testEntryData.map((d) => EntryDTO.fromDomain(d)),
    );
  });

  it("チーム名で取得できる", async () => {});

  it("チームIDで取得できる", async () => {});

  it("存在しないときはエラーを返す", async () => {});
});
