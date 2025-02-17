import { isDepartmentType, isRobotType } from "config";
import { useMemo } from "react";
import type { CSVRow } from "../pages/registerBulk";
import type { ErrorKey } from "../utils/notifyError";

export const errorFields = [
  "teamName",
  "member1",
  "member2",
  "robotType",
  "departmentType",
  "clubName",
] as const;
export type ErrorData = Record<
  (typeof errorFields)[number],
  ErrorKey | undefined
>;

export const useCheckData = (data: CSVRow[]) => {
  const errors: ErrorData[] = useMemo(() => {
    const errs: ErrorData[] = data.map(() => {
      return {
        teamName: undefined,
        member1: undefined,
        member2: undefined,
        robotType: undefined,
        departmentType: undefined,
        clubName: undefined,
      };
    });

    data.forEach((row, i) => {
      const { teamName, member1, member2, robotType, departmentType } = row;

      // 1文字以上
      if (teamName.length < 1) {
        errs[i].teamName = "shortTeamName";
      }
      // 2文字以上
      if (member1.length < 2) {
        errs[i].member1 = "shortMemberName";
      }

      // 2文字以上 or ""
      if (member2 && member2.length < 2) {
        errs[i].member2 = "shortMemberName";
      }

      // 正しい部門
      if (!isDepartmentType(departmentType)) {
        errs[i].departmentType = "invalidCategory";
      }

      // 正しいロボットカテゴリー
      if (!isRobotType(robotType)) {
        errs[i].robotType = "invalidRobotCategory";
      }
    });

    // teamNameの重複チェック
    const teamNameCounts = new Map<string, number>();
    for (const row of data) {
      const count = teamNameCounts.get(row.teamName) ?? 0;
      teamNameCounts.set(row.teamName, count + 1);
    }

    // 出現回数が2以上のteamNameについてエラーを設定
    data.forEach((row, i) => {
      if ((teamNameCounts.get(row.teamName) ?? 0) > 1) {
        errs[i].teamName = "duplicateTeamName";
      }
    });
    return errs;
  }, [data]);
  const isError = errors.some((error) => Object.values(error).some((v) => v));
  return [errors, isError] as const;
};
