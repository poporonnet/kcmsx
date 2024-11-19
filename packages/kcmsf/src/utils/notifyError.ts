import { notifications } from "@mantine/notifications";

export const errorMessages = {
  shortTeamName: "チーム名が短すぎます",
  shortMemberName: "メンバーの名前が短すぎます",
  invalidCategory: "部門が不正です",
  invalidRobotCategory:
    "ロボットのカテゴリーは車輪型または歩行型にしてください",
  shortClubName: "クラブ名が短すぎます",
  duplicateTeamName: "チーム名が重複しています",
} as const;

export type ErrorMessages = (typeof errorMessages)[keyof typeof errorMessages];

export const notifyError = (message: ErrorMessages) => {
  notifications.show({
    title: "不正な形式のファイルです",
    message: message,
    color: "red",
  });
};
