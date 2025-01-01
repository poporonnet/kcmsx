import { DepartmentConfig } from "./departmentConfig";
import { RobotConfig } from "./robotConfig";

export const matchTypes = ["pre", "main"] as const;
export type MatchTypes = typeof matchTypes;
export type MatchType = MatchTypes[number];

/**
 * @description 1つの試合種別設定の型
 */
export type MatchConfig = DerivedMatchConfig<
  string,
  number,
  RobotConfig[],
  DepartmentConfig<RobotConfig[]>[],
  number[],
  DerivedCourseConfig<
    RobotConfig[],
    DepartmentConfig<RobotConfig[]>[],
    number[]
  >,
  number,
  DerivedRequiredTeamsConfig<
    RobotConfig[],
    DepartmentConfig<RobotConfig[]>[],
    number
  >
>;

/**
 * @description 1つの試合種別設定の, リテラル型から導出される型
 */
export type DerivedMatchConfig<
  Name extends string,
  LimitSeconds extends number,
  Robots extends RobotConfig[],
  Departments extends DepartmentConfig<Robots>[],
  Courses extends number[],
  Course extends DerivedCourseConfig<Robots, Departments, Courses>,
  RequiredTeamsNumber extends number,
  RequiredTeams extends DerivedRequiredTeamsConfig<
    Robots,
    Departments,
    RequiredTeamsNumber
  >,
> = Record<
  MatchType,
  {
    name: Name;
    limitSeconds: LimitSeconds;
    course: Course;
    requiredTeams?: RequiredTeams;
  }
>;

/**
 * @description 1つのコース設定の, リテラル型から導出される型
 */
export type DerivedCourseConfig<
  Robots extends RobotConfig[],
  Departments extends DepartmentConfig<Robots>[],
  Courses extends number[],
> = Record<Departments[number]["type"], Courses>;

/**
 * @description 1つの必要チーム数設定の, リテラル型から導出される型
 */
export type DerivedRequiredTeamsConfig<
  Robots extends RobotConfig[],
  Departments extends DepartmentConfig<Robots>[],
  RequiredTeamsNumber extends number,
> = Partial<Record<Departments[number]["type"], RequiredTeamsNumber>>;

/**
 * @description {@link MatchConfig}から導出される試合種別設定の配列
 */
export type DerivedMatches<Match extends MatchConfig> = _DerivedMatches<
  MatchTypes,
  Match
>;

type _DerivedMatches<Types extends MatchTypes, Match extends MatchConfig> = {
  [K in keyof Types]: Match[Types[K]] & { type: Types[K] };
};

/**
 * @description {@link Match}が有効か判定する型
 * {@link MatchConfig}の`course`属性が空ならコンパイルに失敗する
 */
export type ValidMatchConfig<Match extends MatchConfig> =
  ValidCourseConfigs<Match> extends infer C
    ? Match extends C
      ? Match
      : Match & C // `course`が空でも補完を効かせるため
    : never;

/**
 * @description {@link Match}の`course`が有効か判定する型
 * {@link MatchConfig}の`course`オブジェクトが空ならコンパイルに失敗する
 */
type ValidCourseConfigs<Match extends MatchConfig> =
  keyof Match extends MatchType
    ? object extends Match[keyof Match]["course"]
      ? "Empty `course` is not allowed"
      : Match
    : never;
