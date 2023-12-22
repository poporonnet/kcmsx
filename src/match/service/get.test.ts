import { describe, it, expect } from "vitest";
import { DummyMatchRepository } from "../adaptor/dummyRepository.js";
import { Entry } from "../../entry/entry.js";
import { Match } from "../match.js";
import { GetMatchService, MatchDTO } from "./get.js";
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
    expect(res[1]).toStrictEqual(MatchDTO.fromDomain(match));
  });

  it("存在しないときはエラー", async () => {
    const res = await service.findById("222");

    expect(Result.isErr(res)).toStrictEqual(true);
    expect(res[1]).toStrictEqual(new Error("Not found"));
  });
});

describe("MatchDTO", async () => {
  const domain = Match.reconstruct({
    id: "1",
    teams: [
      Entry.new({
        id: "2",
        teamName: "あいうえお",
        members: ["いしや"],
        isMultiWalk: false,
        category: "Open",
      }),
      Entry.new({
        id: "3",
        teamName: "いきしちに",
        members: ["やも"],
        isMultiWalk: true,
        category: "Elementary",
      }),
    ],
    matchType: "primary",
    courseIndex: 0,
    points: [
      {
        teamID: "2",
        points: 1,
      },
      {
        teamID: "3",
        points: 5,
      },
    ],
    time: [30, 50],
    winnerID: "123",
  });

  it("正しくdomainに変換できる", async () => {
    const actual = MatchDTO.fromDomain(domain).toDomain();

    expect(actual.id).toStrictEqual("1");
    expect(actual.teams).toStrictEqual(domain.teams);
    expect(actual.matchType).toStrictEqual("primary");
    expect(actual.courseIndex).toStrictEqual(0);
    expect(actual.points).toStrictEqual(domain.points);
    expect(actual.time).toStrictEqual(domain.time);
    expect(actual.winnerID).toStrictEqual("123");
  });
  it("正しくdtoに変換できる", async () => {
    const actual = MatchDTO.fromDomain(domain);

    expect(actual.id).toStrictEqual("1");
    expect(actual.teams).toStrictEqual(domain.teams);
    expect(actual.matchType).toStrictEqual("primary");
    expect(actual.courseIndex).toStrictEqual(0);
    expect(actual.points).toStrictEqual(domain.points);
    expect(actual.time).toStrictEqual(domain.time);
    expect(actual.winnerID).toStrictEqual("123");
  });
});
