import { notifications } from "@mantine/notifications";
import { isDepartmentType, isRobotType } from "config";
import { CSVRow } from "../pages/registerBulk";

const errorMessages = {
  shortTeamName: "チーム名が短すぎます",
  shortMemberName: "メンバーの名前が短すぎます",
  invalidCategory: "部門が不正です",
  invalidRobotCategory:
    "ロボットのカテゴリーは車輪型または歩行型にしてください",
  shortClubName: "クラブ名が短すぎます",
  duplicateTeamName: "チーム名が重複しています",
};
const notifyError = (error: keyof typeof errorMessages) => {
  notifications.show({
    title: "不正な形式のファイルです",
    message: errorMessages[error],
    color: "red",
  });
};

export const checkData = (data: CSVRow[]) => {
  const newErrors = data.map(() => [false, false, false, false, false, false]);
  let isError = false;
  data.forEach((row, i) => {
    const { teamName, member1, member2, robotType, departmentType } = row;

    // 1文字以上
    if (teamName.length < 1) {
      notifyError("shortTeamName");
      newErrors[i][0] = true;
      isError = true;
    }
    // 3文字以上
    if (member1.length < 3) {
      notifyError("shortMemberName");
      newErrors[i][1] = true;
      isError = true;
    }

    // 3文字以上 or ""
    if (member2 && member2.length < 3) {
      notifyError("shortMemberName");
      newErrors[i][2] = true;
      isError = true;
    }

    // 正しい部門
    if (!isDepartmentType(departmentType)) {
      notifyError("invalidCategory");
      newErrors[i][4] = true;
      isError = true;
    }

    // 正しいロボットカテゴリー
    if (!isRobotType(robotType)) {
      notifyError("invalidRobotCategory");
      newErrors[i][3] = true;
      isError = true;
    }
  });

  // teamNameの重複チェック
  const teamNames = data.map((row) => row.teamName);
  const duplicateTeamNames = teamNames.filter(
    (name, index) => teamNames.indexOf(name) !== index
  );

  // 重複するteamNameがあれば、該当する全ての行にエラーフラグを設定
  if (duplicateTeamNames.length > 0) {
    duplicateTeamNames.forEach((dupName) => {
      teamNames.forEach((name, index) => {
        if (name === dupName) {
          newErrors[index][0] = true;
          isError = true;
          notifyError("duplicateTeamName");
        }
      });
    });
  }
  return { newErrors, isError };
};
