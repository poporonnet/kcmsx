import { describe, expect, it } from "vitest";
import { config } from "../config";
import {
  isDepartmentType,
  isMatchType,
  isRobotType,
  isRuleName,
} from "./typeGuard";

const mayNotTypes = [
  "",
  "dummy1",
  "dummy2",
  "dummy3",
  "ダミーA",
  "ダミーB",
  "ダミーC",
];

describe("isRobotTypeが正しく機能する", () => {
  const robotTypes: string[] = config.robotTypes;

  it("RobotTypeのときtrueを返す", () => {
    robotTypes.forEach((robotType) =>
      expect(isRobotType(robotType)).toBe(true)
    );
  });

  it("RobotTypeでないときfalseを返す", () => {
    const notRobotTypes = mayNotTypes.filter(
      (mayNotRobotType) => !robotTypes.includes(mayNotRobotType)
    ); // ダミーと同じ文字列がRobotTypeに指定される可能性があるのでフィルター

    notRobotTypes.forEach((notRobotType) =>
      expect(isRobotType(notRobotType)).toBe(false)
    );
  });
});

describe("isDepartmentType", () => {
  const departmentTypes: string[] = config.departments.map(
    (department) => department.type
  );

  it("DepartmentTypeのときtrueを返す", () => {
    departmentTypes.forEach((departmentType) =>
      expect(isDepartmentType(departmentType)).toBe(true)
    );
  });

  it("DepartmentTypeでないときfalseを返す", () => {
    const notDepartmentTypes = mayNotTypes.filter(
      (mayNotDepartmentType) => !departmentTypes.includes(mayNotDepartmentType)
    );

    notDepartmentTypes.forEach((notDepartmentType) =>
      expect(isDepartmentType(notDepartmentType)).toBe(false)
    );
  });
});

describe("isMatchType", () => {
  const matchType: string[] = config.matches.map((match) => match.type);

  it("MatchTypeのときtrueを返す", () => {
    matchType.forEach((matchType) => expect(isMatchType(matchType)).toBe(true));
  });

  it("MatchTypeでないときfalseを返す", () => {
    const notMatchTypes = mayNotTypes.filter(
      (mayNotMatchType) => !matchType.includes(mayNotMatchType)
    );

    notMatchTypes.forEach((notMatchType) =>
      expect(isMatchType(notMatchType)).toBe(false)
    );
  });
});

describe("isRuleName", () => {
  const ruleNames: string[] = config.rules.map((rule) => rule.name);

  it("RuleNameのときtrueを返す", () => {
    ruleNames.forEach((ruleName) => expect(isRuleName(ruleName)).toBe(true));
  });

  it("RuleNameでないときfalseを返す", () => {
    const notRuleNames = mayNotTypes.filter(
      (mayNotRuleName) => !ruleNames.includes(mayNotRuleName)
    );

    notRuleNames.forEach((notRuleName) =>
      expect(isRuleName(notRuleName)).toBe(false)
    );
  });
});
