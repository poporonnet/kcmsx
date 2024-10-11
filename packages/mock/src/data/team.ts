import { DepartmentType, RobotType } from "config";

export interface Team {
  id: string;
  name: string;
  entryCode: string;
  members: string[];
  clubName: string;
  robotType: RobotType;
  departmentType: DepartmentType;
  isEntered: boolean;
}

export const teams = [
  {
    id: "1392387",
    name: "かに1",
    entryCode: "1",
    members: ["メンバー1", "メンバー2"],
    clubName: "RubyClub",
    robotType: "wheel",
    departmentType: "elementary",
    isEntered: true,
  },
  {
    id: "7549586",
    name: "かに2",
    entryCode: "2",
    members: ["メンバー3"],
    clubName: "RubyClub",
    robotType: "wheel",
    departmentType: "elementary",
    isEntered: false,
  },
  {
    id: "4578932",
    name: "かに3",
    entryCode: "3",
    members: ["メンバー4"],
    clubName: "",
    robotType: "leg",
    departmentType: "elementary",
    isEntered: true,
  },
] as const satisfies Team[];
