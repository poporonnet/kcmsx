import { config } from "../../config";

type Config = typeof config;

export type RobotType = Config["robotTypes"][number];

export type Department = Config["departments"][number];
export type DepartmentType = Department["type"];

export type Match = Config["matches"][number];
export type MatchType = Match["type"];
