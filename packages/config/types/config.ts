import { DerivedMatch, MatchConfig } from "./matchConfig";
import { DepartmentConfig, DerivedDepartment } from "./departmentConfig";
import { RuleBaseList, RuleList, ValidRuleList } from "./rule";

/**
 * @description `createConfig`に入力する設定の型
 */
export type BaseConfig<
  ContestName extends string,
  RobotTypes extends string[],
  Departments extends DepartmentConfig<RobotTypes>[],
  Matches extends MatchConfig[],
  RuleBases extends RuleBaseList,
> = {
  contestName: ContestName;
  robotTypes: RobotTypes;
  departments: Departments;
  matches: Matches;
  rules: ValidRuleList<RuleBases>;
};

/**
 * @description `createConfig`が出力する設定の型
 */
export type Config<
  ContestName extends string,
  RobotTypes extends string[],
  Departments extends DepartmentConfig<RobotTypes>[],
  Matches extends MatchConfig[],
  Rules extends RuleList,
> = {
  contestName: ContestName;
  robotTypes: RobotTypes;
  departments: Departments;
  matches: Matches;
  rules: ValidRuleList<Rules>;
  department: DerivedDepartment<RobotTypes, Departments>;
  match: DerivedMatch<Matches>;
};
