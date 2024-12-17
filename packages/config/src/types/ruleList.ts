import { ConditionsConfig } from "./conditionsConfig";
import { DepartmentConfig } from "./departmentConfig";
import { MatchConfig } from "./matchConfig";
import { RobotConfig } from "./robotConfig";
import { RuleBaseList } from "./rule";

/**
 * @description リテラル型から導出される実際のRuleListの型
 */
export type DerivedRuleList<
  RuleBases extends RuleBaseList,
  Robots extends RobotConfig[],
  Match extends MatchConfig,
  Departments extends DepartmentConfig<Robots>[],
  Conditions extends ConditionsConfig<Robots, RuleBases, Match, Departments>,
> = {
  [K in keyof RuleBases]: RuleBases[K] &
    Readonly<Conditions[RuleBases[K]["name"]]>;
};
