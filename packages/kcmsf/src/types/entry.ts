import { DepartmentType, RobotType } from "config";

export type Entry = {
  name: string;
  members: string[];
  robotType: RobotType;
  departmentType: DepartmentType;
  clubName: string;
};
