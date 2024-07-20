import { DerivedMatch, MatchConfig } from "../types/matchConfig";
import { BaseConfig, Config } from "../types/config";
import { DepartmentConfig, DerivedDepartment } from "../types/departmentConfig";
import { RuleBaseList, ValidRuleList } from "../types/rule";
import { ConditionsConfig } from "../types/conditionsConfig";
import { DerivedRuleList } from "../types/ruleList";

export const createConfig = <
  ContestName extends string,
  RobotTypes extends string[],
  Departments extends DepartmentConfig<RobotTypes>[],
  Matches extends MatchConfig[],
  RuleBases extends RuleBaseList,
  Conditions extends ConditionsConfig<
    RobotTypes,
    RuleBases,
    Matches,
    Departments
  >,
>(
  baseConfig: BaseConfig<
    ContestName,
    RobotTypes,
    Departments,
    Matches,
    RuleBases
  >,
  conditions: ConditionsConfig<RobotTypes, RuleBases, Matches, Departments>
): Readonly<
  Config<
    ContestName,
    RobotTypes,
    Departments,
    Matches,
    DerivedRuleList<RuleBases, RobotTypes, Matches, Departments, Conditions>
  >
> => ({
  contestName: baseConfig.contestName,
  robotTypes: baseConfig.robotTypes,
  departments: baseConfig.departments,
  matches: baseConfig.matches,
  rules: baseConfig.rules.map<
    DerivedRuleList<
      RuleBaseList,
      RobotTypes,
      Matches,
      Departments,
      Conditions
    >[number]
  >((ruleBase) => {
    const name: RuleBases[number]["name"] = ruleBase.name;
    const condition = conditions[name];

    const premise =
      condition && "premise" in condition ? { premise: condition.premise } : {};
    const visible =
      condition && "visible" in condition ? { visible: condition.visible } : {};
    return {
      ...ruleBase,
      ...premise,
      ...visible,
    };
  }) as ValidRuleList<
    DerivedRuleList<RuleBases, RobotTypes, Matches, Departments, Conditions>
  >,
  department: Object.fromEntries(
    baseConfig.departments.map<
      [Departments[number]["type"], Omit<DepartmentConfig<RobotTypes>, "type">]
    >(({ type, id, name, robotTypes }) => [type, { id, name, robotTypes }])
  ) as DerivedDepartment<RobotTypes, Departments>,
  match: Object.fromEntries(
    baseConfig.matches.map<
      [Matches[number]["type"], Omit<MatchConfig, "type">]
    >(({ type, name, limitSeconds }) => [type, { name, limitSeconds }])
  ) as DerivedMatch<Matches>,
});