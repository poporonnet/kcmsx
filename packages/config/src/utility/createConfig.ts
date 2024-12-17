import { ConditionsConfig } from "../types/conditionsConfig";
import { BaseConfig, Config } from "../types/config";
import {
  DepartmentConfig,
  DerivedDepartment,
  DerivedDepartmentConfig,
} from "../types/departmentConfig";
import {
  DerivedCourseConfig,
  DerivedMatchConfig,
  DerivedMatches,
  matchTypes,
} from "../types/matchConfig";
import {
  DerivedRobot,
  DerivedRobotConfig,
  RobotConfig,
} from "../types/robotConfig";
import {
  DerivedRuleBaseVariant,
  RuleBaseList,
  RuleType,
  StateType,
  ValidRuleList,
} from "../types/rule";
import { DerivedRuleList } from "../types/ruleList";
import { DerivedSponsorConfig, SponsorClass } from "../types/sponsorConfig";
import { pick } from "./pick";

export const createConfig = <
  ContestName extends string,
  RobotType extends string,
  RobotName extends string,
  Robot extends DerivedRobotConfig<RobotType, RobotName>,
  Robots extends [Robot, ...Robot[]],
  DepartmentType extends string,
  DepartmentName extends string,
  DepartmentRobotTypes extends [
    Robots[number]["type"],
    ...Robots[number]["type"][],
  ],
  Department extends DerivedDepartmentConfig<
    DepartmentType,
    DepartmentName,
    DepartmentRobotTypes
  >,
  Departments extends [Department, ...Department[]],
  MatchName extends string,
  MatchLimitSeconds extends number,
  MatchCourseIndex extends number,
  MatchCourses extends [] | [MatchCourseIndex, ...MatchCourseIndex[]],
  MatchCourse extends DerivedCourseConfig<Robots, Departments, MatchCourses>,
  Match extends DerivedMatchConfig<
    MatchName,
    MatchLimitSeconds,
    Robots,
    Departments,
    MatchCourses,
    MatchCourse
  >,
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
  Conditions extends ConditionsConfig<Robots, RuleBases, Match, Departments>,
>(
  baseConfig: BaseConfig<
    ContestName,
    Robots,
    Departments,
    Match,
    RuleBaseType,
    RuleBaseInitial,
    RuleBases,
    Sponsors
  >,
  conditions: ConditionsConfig<Robots, RuleBases, Match, Departments>
): Readonly<
  Config<
    ContestName,
    Robots,
    Departments,
    Match,
    RuleBaseType,
    RuleBaseInitial,
    DerivedRuleList<RuleBases, Robots, Match, Departments, Conditions>,
    Sponsors
  >
> => ({
  contestName: baseConfig.contestName,
  robots: baseConfig.robots,
  departments: baseConfig.departments,
  match: baseConfig.match,
  rules: baseConfig.rules.map<
    DerivedRuleList<
      RuleBaseList,
      Robots,
      Match,
      Departments,
      ConditionsConfig<Robots, RuleBaseList, Match, Departments>
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
    DerivedRuleList<RuleBases, Robots, Match, Departments, Conditions>
  >,
  sponsors: baseConfig.sponsors,
  robotTypes: pick(baseConfig.robots, "type"),
  robot: Object.fromEntries(
    baseConfig.robots.map<[Robots[number]["type"], Omit<RobotConfig, "type">]>(
      ({ type, name }) => [type, { name }]
    )
  ) as DerivedRobot<Robots>,
  departmentTypes: pick(baseConfig.departments, "type"),
  department: Object.fromEntries(
    baseConfig.departments.map<
      [Departments[number]["type"], Omit<DepartmentConfig<Robots>, "type">]
    >(({ type, name, robotTypes }) => [type, { name, robotTypes }])
  ) as DerivedDepartment<Robots, Departments>,
  matchTypes: matchTypes,
  matches: matchTypes.map<DerivedMatches<Match>[number]>((matchType) => ({
    type: matchType,
    ...baseConfig.match[matchType],
  })) as unknown as DerivedMatches<Match>,
});
