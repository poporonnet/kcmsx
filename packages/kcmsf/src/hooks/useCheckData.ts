import { isDepartmentType, isRobotType } from "config";
import { CSVRow } from "../pages/registerBulk";
import { errorMessages } from "../utils/notifyError";

export type ErrorData = {
  teamName?: string;
  member1?: string;
  member2:? string;
  robotType?: string;
  departmentType?: string;
  clubName?: string;
};
export const useCheckData = (data: CSVRow[]) => {
  const errors: ErrorData[] = data.map(() => {
    return {
      teamName: [],
      member1: [],
      member2: [],
      robotType: [],
      departmentType: [],
      clubName: [],
    };
  });
  data.forEach((row, i) => {
    const { teamName, member1, member2, robotType, departmentType } = row;

    // 1文字以上
    if (teamName.length < 1) {
      errors[i].teamName.push(errorMessages.shortTeamName);
    }
    // 3文字以上
    if (member1.length < 3) {
      errors[i].member1.push(errorMessages.shortMemberName);
    }

    // 3文字以上 or ""
    if (member2 && member2.length < 3) {
      errors[i].member2.push(errorMessages.shortMemberName);
    }

    // 正しい部門
    if (!isDepartmentType(departmentType)) {
      errors[i].departmentType.push(errorMessages.invalidCategory);
    }

    // 正しいロボットカテゴリー
    if (!isRobotType(robotType)) {
      errors[i].robotType.push(errorMessages.invalidRobotCategory);
    }
  });

  // teamNameの重複チェック
  const teamNames = data.map((row) => row.teamName);
  console.log(teamNames);
  const uniqueTeamNames = new Set(teamNames);
  if (teamNames.length !== uniqueTeamNames.size) {
    teamNames.forEach((teamName, i) => {
      if (teamNames.indexOf(teamName) !== i) {
        errors[i].teamName.push(errorMessages.duplicateTeamName);
      }
    });
  }

  return errors;
};
