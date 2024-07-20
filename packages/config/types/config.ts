import { DerivedMatch, MatchConfig } from "./matchConfig";
import { DepartmentConfig, DerivedDepartment } from "./departmentConfig";
import { RuleBaseList, RuleList, ValidRuleList } from "./rule";

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
