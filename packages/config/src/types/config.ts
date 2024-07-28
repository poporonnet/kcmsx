import {
  DepartmentConfig,
  DerivedDepartment,
  ValidDepartmentConfigs,
} from "./departmentConfig";
import { DerivedMatch, MatchConfig, ValidMatchConfigs } from "./matchConfig";
import { ValidRobotTypes } from "./robotConfig";
import {
  DerivedRuleBaseVariant,
  RuleList,
  RuleType,
  StateType,
  ValidRuleList,
} from "./rule";

/**
 * @description `createConfig`に入力する設定の型
 */
export type BaseConfig<
  ContestName extends string,
  RobotTypes extends string[],
  Departments extends DepartmentConfig<RobotTypes>[],
  Matches extends MatchConfig[],
  RuleBaseType extends RuleType,
  RuleBaseInitial extends StateType[RuleBaseType],
  RuleBases extends DerivedRuleBaseVariant<RuleBaseType, RuleBaseInitial>[],
> = {
  contestName: ContestName;
  robotTypes: ValidRobotTypes<RobotTypes>;
  departments: ValidDepartmentConfigs<RobotTypes, Departments>;
  matches: ValidMatchConfigs<Matches>;
  rules: ValidRuleList<RuleBaseType, RuleBaseInitial, RuleBases>;
};

/**
 * @description `createConfig`が出力する設定の型
 */
export type Config<
  ContestName extends string,
  RobotTypes extends string[],
  Departments extends DepartmentConfig<RobotTypes>[],
  Matches extends MatchConfig[],
  Type extends RuleType,
  Initial extends StateType[Type],
  Rules extends RuleList<Type, Initial>,
> = {
  contestName: ContestName;
  robotTypes: ValidRobotTypes<RobotTypes>;
  departments: ValidDepartmentConfigs<RobotTypes, Departments>;
  matches: ValidMatchConfigs<Matches>;
  rules: ValidRuleList<Type, Initial, Rules>;
  department: DerivedDepartment<RobotTypes, Departments>;
  match: DerivedMatch<Matches>;
};
