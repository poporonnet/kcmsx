import { DepartmentConfig } from "./departmentConfig";
import { MatchConfig } from "./matchConfig";
import { DerivedPointState, RuleBaseList, RuleCondition } from "./rule";

export type ConditionsConfig<
  RobotTypes extends string[],
  RuleBases extends RuleBaseList,
  Matches extends MatchConfig[],
  Departments extends DepartmentConfig<RobotTypes>[],
> = {
  [K in RuleBases[number]["name"]]?: RuleCondition<
    Matches[number]["type"],
    Departments[number]["type"],
    DerivedPointState<RuleBases[number]>
  >;
};
