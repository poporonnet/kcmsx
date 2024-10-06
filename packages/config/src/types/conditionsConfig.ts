import { DepartmentConfig } from "./departmentConfig";
import { MatchConfig } from "./matchConfig";
import { RobotConfig } from "./robotConfig";
import { DerivedPointState, RuleBaseList, RuleCondition } from "./rule";

/**
 * @description すべてのルールに対する{@link RuleCondition}の設定オブジェクトの型
 */
export type ConditionsConfig<
  Robots extends RobotConfig[],
  RuleBases extends RuleBaseList,
  Matches extends MatchConfig[],
  Departments extends DepartmentConfig<Robots>[],
> = {
  [K in RuleBases[number]["name"]]?: RuleCondition<
    Matches[number]["type"],
    Departments[number]["type"],
    DerivedPointState<RuleBases[number]>
  >;
};
