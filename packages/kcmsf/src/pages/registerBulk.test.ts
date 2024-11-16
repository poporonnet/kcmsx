// registerBulk.test.tsx
import { afterEach, describe, expect, it, vi } from "vitest";
import { checkData } from "../utils/checkBulkData";
import { CSVRow } from "./registerBulk";
describe("checkData", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });
  it("正常なデータの場合、エラーを返さない", () => {
    const data: CSVRow[] = [
      {
        teamName: "チーム1",
        member1: "さくら",
        member2: "あおい",
        robotType: "leg",
        departmentType: "elementary",
        clubName: "Rubyクラブ",
      },
    ];
    const { newErrors, isError } = checkData(data);
    expect(isError).toBe(false);
    expect(newErrors[0]).toEqual([false, false, false, false, false, false]);
  });

  it("チーム名が重複している場合、エラーを返す", () => {
    const data = [
      {
        teamName: "チーム1",
        member1: "さくら",
        member2: "あおい",
        robotType: "leg",
        departmentType: "elementary",
        clubName: "Rubyクラブ",
      },
      {
        teamName: "チーム1",
        member1: "はな",
        member2: "もも",
        robotType: "leg",
        departmentType: "elementary",
        clubName: "Pythonクラブ",
      },
    ];

    const { newErrors, isError } = checkData(data as CSVRow[]);
    expect(isError).toBe(true);
    expect(newErrors[0][0]).toBe(true);
    expect(newErrors[1][0]).toBe(true);
  });

  it("メンバー名が3文字未満の場合、エラーを返す", () => {
    const data = [
      {
        teamName: "チーム1",
        member1: "さ",
        member2: "あ",
        robotType: "leg",
        departmentType: "elementary",
        clubName: "Rubyクラブ",
      },
    ];

    const { newErrors, isError } = checkData(data as CSVRow[]);
    expect(isError).toBe(true);
    expect(newErrors[0][1]).toBe(true);
    expect(newErrors[0][2]).toBe(true);
  });

  it("無効なロボットタイプの場合、エラーを返す", () => {
    const data = [
      {
        teamName: "チーム1",
        member1: "さくら",
        member2: "あおい",
        robotType: "invalid",
        departmentType: "elementary",
        clubName: "Rubyクラブ",
      },
    ];

    const { newErrors, isError } = checkData(data as CSVRow[]);
    expect(isError).toBe(true);
    expect(newErrors[0][3]).toBe(true);
  });
});
