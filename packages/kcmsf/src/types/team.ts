import { DepartmentType, RobotType } from "config";

/**
 * チーム
 */
export type Team = {
  id: string;
  name: string;
  entryCode: string;
  members: string[];
  clubName: string;
  robotType: RobotType;
  departmentType: DepartmentType;
  isEntered: boolean;
};

/**
 * チーム作成に必要な情報
 * @description `POST /team`のみで使われる
 */
export type CreateTeamArgs = Omit<Team, "id" | "entryCode" | "isEntered">;
