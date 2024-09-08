import { ConditionsConfig } from "../types/conditionsConfig";
import { BaseConfig, Config } from "../types/config";
import {
  DepartmentConfig,
  DerivedDepartment,
  DerivedDepartmentConfig,
} from "../types/departmentConfig";
import {
  DerivedCourseConfig,
  DerivedMatch,
  DerivedMatchConfig,
  MatchConfig,
} from "../types/matchConfig";
import {
  DerivedRuleBaseVariant,
  RuleBaseList,
  RuleType,
  StateType,
  ValidRuleList,
} from "../types/rule";
import { DerivedRuleList } from "../types/ruleList";
import { DerivedSponsorConfig, SponsorClass } from "../types/sponsorConfig";

export const createConfig = <
  ContestName extends string,
  RobotType extends string,
  RobotTypes extends [RobotType, ...RobotType[]],
  DepartmentType extends string,
  DepartmentName extends string,
  DepartmentRobotTypes extends [RobotTypes[number], ...RobotTypes[number][]],
  Department extends DerivedDepartmentConfig<
    DepartmentType,
    DepartmentName,
    DepartmentRobotTypes
  >,
  Departments extends [Department, ...Department[]],
  MatchType extends string,
  MatchName extends string,
  MatchLimitSeconds extends number,
  MatchCourse extends DerivedCourseConfig<RobotTypes, Departments>,
  Match extends DerivedMatchConfig<
    MatchType,
    MatchName,
    MatchLimitSeconds,
    RobotTypes,
    Departments,
    MatchCourse
  >,
  Matches extends [Match, ...Match[]],
  RuleBaseName extends string,
  RuleBaseLabel extends string,
  RuleBaseType extends RuleType,
  RuleBaseInitial extends StateType[RuleBaseType],
  RuleBase extends DerivedRuleBaseVariant<
    RuleBaseType,
    RuleBaseInitial,
    RuleBaseName,
    RuleBaseLabel
  >,
  RuleBases extends [RuleBase, ...RuleBase[]],
  SponsorName extends string,
  SponsorClassType extends SponsorClass,
  SponsorLogo extends string,
  Sponsor extends DerivedSponsorConfig<
    SponsorName,
    SponsorClassType,
    SponsorLogo
  >,
  Sponsors extends [] | [Sponsor, ...Sponsor[]],
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
    RuleBaseType,
    RuleBaseInitial,
    RuleBases,
    Sponsors
  >,
  conditions: ConditionsConfig<RobotTypes, RuleBases, Matches, Departments>
): Readonly<
  Config<
    ContestName,
    RobotTypes,
    Departments,
    Matches,
    RuleBaseType,
    RuleBaseInitial,
    DerivedRuleList<RuleBases, RobotTypes, Matches, Departments, Conditions>,
    Sponsors
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
      ConditionsConfig<RobotTypes, RuleBaseList, Matches, Departments>
    >[number]
  >((ruleBase) => {
    const name: RuleBases[number]["name"] = ruleBase.name;
    const condition = conditions[name];

    return {
      ...ruleBase,
      ...condition,
    };
  }) as ValidRuleList<
    RuleBaseType,
    RuleBaseInitial,
    DerivedRuleList<RuleBases, RobotTypes, Matches, Departments, Conditions>
  >,
  sponsors: baseConfig.sponsors,
  department: Object.fromEntries(
    baseConfig.departments.map<
      [Departments[number]["type"], Omit<DepartmentConfig<RobotTypes>, "type">]
    >(({ type, name, robotTypes }) => [type, { name, robotTypes }])
  ) as DerivedDepartment<RobotTypes, Departments>,
  match: Object.fromEntries(
    baseConfig.matches.map<
      [Matches[number]["type"], Omit<MatchConfig, "type">]
    >(({ type, name, limitSeconds, course }) => [
      type,
      { name, limitSeconds, course },
    ])
  ) as DerivedMatch<Matches>,
});
