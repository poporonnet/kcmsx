import { ConditionsConfig } from "./conditionsConfig";
import { DepartmentConfig } from "./departmentConfig";
import { MatchConfig } from "./matchConfig";
import { RuleBaseList } from "./rule";

/**
 * @description リテラル型から導出される実際のRuleListの型
 */
export type DerivedRuleList<
  RuleBases extends RuleBaseList,
  RobotTypes extends string[],
  Matches extends MatchConfig[],
  Departments extends DepartmentConfig<RobotTypes>[],
  Conditions extends ConditionsConfig<
    RobotTypes,
    RuleBases,
    Matches,
    Departments
  >,
> = {
  [K in keyof RuleBases]: RuleBases[K] &
    Readonly<Conditions[RuleBases[K]["name"]]>;
};