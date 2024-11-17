// registerBulk.test.tsx
import { afterEach, describe, expect, it, vi } from "vitest";
import { CSVRow } from "../pages/registerBulk";
import { errorMessages } from "../utils/notifyError";
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
    const errors = useCheckData(data);
    expect(errors[0]).toEqual({
      teamName: [],
      member1: [],
      member2: [],
      robotType: [],
      departmentType: [],
      clubName: [],
    });
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

    const errors = useCheckData(data as CSVRow[]);
    expect(errors[1].teamName).toEqual([errorMessages.duplicateTeamName]);
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

    const errors = useCheckData(data as CSVRow[]);
    expect(errors[0].member1).toEqual([errorMessages.shortMemberName]);
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

    const errors = useCheckData(data as CSVRow[]);
    expect(errors[0].robotType).toEqual([errorMessages.invalidRobotCategory]);
  });
});
