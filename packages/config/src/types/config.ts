import {
  DepartmentConfig,
  DerivedDepartment,
  DerivedDepartmentTypes,
  ValidDepartmentConfigs,
} from "./departmentConfig";
import {
  DerivedMatches,
  MatchConfig,
  MatchTypes,
  ValidMatchConfig,
} from "./matchConfig";
import {
  DerivedRobot,
  DerivedRobotTypes,
  RobotConfig,
  ValidRobotConfigs,
} from "./robotConfig";
import {
  DerivedRuleBaseVariant,
  RuleList,
  RuleType,
  StateType,
  ValidRuleList,
} from "./rule";
import { SponsorConfig, ValidSponsorConfigs } from "./sponsorConfig";

/**
 * @description `createConfig`に入力する設定の型
 */
export type BaseConfig<
  ContestName extends string,
  Robots extends RobotConfig[],
  Departments extends DepartmentConfig<Robots>[],
  Match extends MatchConfig,
  RuleBaseType extends RuleType,
  RuleBaseInitial extends StateType[RuleBaseType],
  RuleBases extends DerivedRuleBaseVariant<RuleBaseType, RuleBaseInitial>[],
  Sponsors extends SponsorConfig[],
> = {
  contestName: ContestName;
  robots: ValidRobotConfigs<Robots>;
  departments: ValidDepartmentConfigs<Robots, Departments>;
  match: ValidMatchConfig<Match>;
  rules: ValidRuleList<RuleBaseType, RuleBaseInitial, RuleBases>;
  sponsors: ValidSponsorConfigs<Sponsors>;
};

/**
 * @description `createConfig`が出力する設定の型
 */
export type Config<
  ContestName extends string,
  Robots extends RobotConfig[],
  Departments extends DepartmentConfig<Robots>[],
  Match extends MatchConfig,
  Type extends RuleType,
  Initial extends StateType[Type],
  Rules extends RuleList<Type, Initial>,
  Sponsors extends SponsorConfig[],
> = {
  contestName: ContestName;
  robots: ValidRobotConfigs<Robots>;
  departments: ValidDepartmentConfigs<Robots, Departments>;
  match: ValidMatchConfig<Match>;
  rules: ValidRuleList<Type, Initial, Rules>;
  sponsors: ValidSponsorConfigs<Sponsors>;
  robotTypes: DerivedRobotTypes<ValidRobotConfigs<Robots>>;
  robot: DerivedRobot<Robots>;
  departmentTypes: DerivedDepartmentTypes<
    Robots,
    ValidDepartmentConfigs<Robots, Departments>
  >;
  department: DerivedDepartment<Robots, Departments>;
  matchTypes: MatchTypes;
  matches: DerivedMatches<Match>;
};
