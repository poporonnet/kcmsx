import { config } from "../config";
import { DepartmentType, MatchType, RobotType } from "../types/derived/config";
import { RuleName } from "../types/derived/rule";

export const isRobotType = (value: string): value is RobotType =>
  config.robotTypes.some((robotTypes) => robotTypes === value);

export const isDepartmentType = (value: string): value is DepartmentType =>
  config.departments.some((department) => department.type === value);

export const isMatchType = (value: string): value is MatchType =>
  config.matches.some((match) => match.type === value);

export const isRuleName = (value: string): value is RuleName =>
  config.rules.some((rule) => rule.name === value);
