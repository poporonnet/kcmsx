import { describe, expect, it } from "vitest";
import { GenerateMatchService } from "./generate.js";
import { DummyRepository } from "../../entry/adaptor/dummyRepository.js";
import { Entry } from "../../entry/entry.js";
import { Result } from "@mikuroxina/mini-fn";
import { DummyMatchRepository } from "../adaptor/dummyRepository.js";

const generateDummyData = (n: number): Entry[] => {
  const res: Entry[] = Array<Entry>();

  for (let i = 0; i < n; i++) {
    res.push(
      Entry.new({
        id: `${i + 1}`,
        teamName: `チーム ${i + 1}`,
        members: [`チーム${i + 1}のメンバー1`],
        isMultiWalk: true,
        // 1~8がOpen, 9~16がElementary
        category: i < 8 ? "Open" : "Elementary",
      }),
    );
  }
  return res;
};

describe("予選の対戦表を正しく生成できる", async () => {
  const repository = new DummyRepository();
  const matchRepository = new DummyMatchRepository();
  const service = new GenerateMatchService(repository, matchRepository);
  const dummyData = generateDummyData(32);
  console.log(dummyData.length);
  dummyData.map((v) => repository.create(v));

  it("初期状態の対戦表を生成できる", async () => {
    const res = await service.generatePrimaryMatch();
    expect(Result.isErr(res)).toStrictEqual(false);
    for (const v of Result.unwrap(res)) {
      for (const j of v) {
        expect(j.teams.left!.id).not.toBe(j.teams.right!.id);
        expect(j.teams.left!.category).toStrictEqual(j.teams.right!.category);
        console.log(
          parseInt(j.teams.left!.id) - 8,
          parseInt(j.teams.right!.id) - 8,
        );
      }
      console.log("----------------------------------");
    }
  });
});

describe("本選の対戦表を正しく生成できる", async () => {
  const repository = new DummyRepository();
  const matchRepository = new DummyMatchRepository();
  const service = new GenerateMatchService(repository, matchRepository);
  const dummyData = generateDummyData(16);
  dummyData.map((v) => repository.create(v));

  const match = await service.generatePrimaryMatch();
  if (Result.isErr(match)) {
    return;
  }
  match[1].map((v) => {
    v.map((j) => {
      j.results = {
        left: {
          teamID: j.teams.left?.id ?? "",
          points: Number(j.teams.left?.id ?? 0),
          time: Number(j.teams.left?.id ?? 0),
        },
        right: {
          teamID: j.teams.right?.id ?? "",
          points: Number(j.teams.right?.id ?? 0),
          time: Number(j.teams.right?.id ?? 0),
        },
      };
      // fixme: 消す(最下位とその1つ上の点数を同じにしている)
      if (j.teams.left) {
        if (j.teams.left.id === "1") {
          j.results.left.points = 0;
          j.results.left.time = 0;
        }
      }
      if (j.teams.right) {
        if (j.teams.right.id === "1") {
          j.results.right.points = 0;
          j.results.right.time = 1;
        }
      }
      matchRepository.update(j);
    });
  });

  it("ランキングを正しく生成できる", async () => {
    await service.generateRanking();
  });

  it("本選の対戦表を正しく生成できる", async () => {
    await service.generateFinalMatch("elementary");
  });
});
