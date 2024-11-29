import { renderHook } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import type { CSVRow } from "../pages/registerBulk";
import { useCheckData } from "./useCheckData";
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
    const { result } = renderHook(() => useCheckData(data));
    expect(result.current[0][0]).toEqual({
      teamName: undefined,
      member1: undefined,
      member2: undefined,
      robotType: undefined,
      departmentType: undefined,
      clubName: undefined,
    });
    expect(result.current[1]).toEqual(false);
  });

  it("チーム名が重複している場合、エラーを返す", () => {
    const data: CSVRow[] = [
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

    const { result } = renderHook(() => useCheckData(data));
    expect(result.current[0][0].teamName).toEqual("duplicateTeamName");
    expect(result.current[0][1].teamName).toEqual("duplicateTeamName");
    expect(result.current[1]).toEqual(true);
  });

  it("メンバー名が3文字未満の場合、エラーを返す", () => {
    const data: CSVRow[] = [
      {
        teamName: "チーム1",
        member1: "さ",
        member2: "あ",
        robotType: "leg",
        departmentType: "elementary",
        clubName: "Rubyクラブ",
      },
    ];

    const { result } = renderHook(() => useCheckData(data));
    expect(result.current[0][0].member1).toEqual("shortMemberName");
    expect(result.current[0][0].member2).toEqual("shortMemberName");
    expect(result.current[1]).toEqual(true);
  });

  it("無効なロボット種別の場合、エラーを返す", () => {
    const data: CSVRow[] = [
      {
        teamName: "チーム1",
        member1: "さくら",
        member2: "あおい",
        robotType: "invalid",
        departmentType: "elementary",
        clubName: "Rubyクラブ",
      },
    ];

    const { result } = renderHook(() => useCheckData(data));
    expect(result.current[0][0].robotType).toEqual("invalidRobotCategory");
    expect(result.current[1]).toEqual(true);
  });
});
