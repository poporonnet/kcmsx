import { isDepartmentType, isRobotType } from "config";
import { useState } from "react";
import type { CSVRow } from "../pages/registerBulk";
import { errorMessages, type ErrorMessages } from "../utils/notifyError";

export const errorFields = [
  "teamName",
  "member1",
  "member2",
  "robotType",
  "departmentType",
  "clubName",
] as const;
type ErrorData = Record<(typeof errorFields)[number], ErrorMessages | "">;

export const useCheckData = (csv: CSVRow[]) => {
  const [data] = useState(csv);
  const errors: ErrorData[] = data.map(() => {
    return {
      teamName: "",
      member1: "",
      member2: "",
      robotType: "",
      departmentType: "",
      clubName: "",
    };
  });
  data.forEach((row, i) => {
    const { teamName, member1, member2, robotType, departmentType } = row;

    // 1文字以上
    if (teamName.length < 1) {
      errors[i].teamName = errorMessages.shortTeamName;
    }
    // 3文字以上
    if (member1.length < 3) {
      errors[i].member1 = errorMessages.shortMemberName;
    }

    // 3文字以上 or ""
    if (member2 && member2.length < 3) {
      errors[i].member2 = errorMessages.shortMemberName;
    }

    // 正しい部門
    if (!isDepartmentType(departmentType)) {
      errors[i].departmentType = errorMessages.invalidCategory;
    }

    // 正しいロボットカテゴリー
    if (!isRobotType(robotType)) {
      errors[i].robotType = errorMessages.invalidRobotCategory;
    }
  });

  // teamNameの重複チェック
  const teamNameCounts = data.reduce<Record<string, number>>((acc, row) => {
    acc[row.teamName] = (acc[row.teamName] || 0) + 1;
    return acc;
  }, {});

  // 出現回数が2以上のteamNameについてエラーを設定
  data.forEach((row, i) => {
    if (teamNameCounts[row.teamName] > 1) {
      errors[i].teamName = errorMessages.duplicateTeamName;
    }
  });

  return errors;
};
