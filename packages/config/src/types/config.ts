import {
  DepartmentConfig,
  DerivedDepartment,
  ValidDepartmentConfigs,
} from "./departmentConfig";
import { DerivedMatch, MatchConfig, ValidMatchConfigs } from "./matchConfig";
import { ValidRobotTypes } from "./robotConfig";
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
  robotTypes: ValidRobotTypes<RobotTypes>;
  departments: ValidDepartmentConfigs<RobotTypes, Departments>;
  matches: ValidMatchConfigs<Matches>;
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
  robotTypes: ValidRobotTypes<RobotTypes>;
  departments: ValidDepartmentConfigs<RobotTypes, Departments>;
  matches: ValidMatchConfigs<Matches>;
  rules: ValidRuleList<Rules>;
  department: DerivedDepartment<RobotTypes, Departments>;
  match: DerivedMatch<Matches>;
};
