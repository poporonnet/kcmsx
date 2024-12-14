import { Collect } from "../utility/pick";
import { DepartmentConfig } from "./departmentConfig";
import { RobotConfig } from "./robotConfig";
import { UniqueRecords } from "./uniqueCollection";

/**
 * @description 1つの試合種別設定の型
 */
export type MatchConfig = DerivedMatchConfig<
  string,
  string,
  number,
  RobotConfig[],
  DepartmentConfig<RobotConfig[]>[],
  number[],
  DerivedCourseConfig<
    RobotConfig[],
    DepartmentConfig<RobotConfig[]>[],
    number[]
  >
>;

/**
 * @description 1つの試合種別設定の, リテラル型から導出される型
 */
export type DerivedMatchConfig<
  Type extends string,
  Name extends string,
  LimitSeconds extends number,
  Robots extends RobotConfig[],
  Departments extends DepartmentConfig<Robots>[],
  Courses extends number[],
  Course extends DerivedCourseConfig<Robots, Departments, Courses>,
> = {
  type: Type;
  name: Name;
  limitSeconds: LimitSeconds;
  course: Course;
};

/**
 * @description 1つのコース設定の, リテラル型から導出される型
 */
export type DerivedCourseConfig<
  Robots extends RobotConfig[],
  Departments extends DepartmentConfig<Robots>[],
  Courses extends number[],
> = Partial<Record<Departments[number]["type"], Courses>>;

/**
 * @description {@link MatchConfig}の配列から導出される試合種別設定のオブジェクト
 */
export type DerivedMatch<Matches extends MatchConfig[]> = {
  [M in Matches[number] as M["type"]]: Omit<M, "type">;
};

/**
 * @description {@link MatchConfig}の配列から導出される試合種別設定の`type`属性の配列
 */
export type DerivedMatchTypes<Matches extends MatchConfig[]> = Collect<
  MatchConfig,
  Matches,
  "type"
>;

/**
 * @description {@link Matches}が有効か判定する型
 * {@link MatchConfig}の`type`属性が重複していたらコンパイルに失敗する
 */
export type ValidMatchConfigs<Matches extends MatchConfig[]> =
  UniqueRecords<Matches, "type"> extends infer U
    ? ValidCourseConfigs<Matches> extends infer C
      ? Matches extends U
        ? Matches extends C
          ? Matches
          : Matches & C // `course`が空でも補完を効かせるため
        : Matches & U // `course`が空でも補完を効かせるため
      : never
    : never;

/**
 * @description {@link Matches}の`course`が有効か判定する型
 * {@link MatchConfig}の`course`オブジェクトが空ならコンパイルに失敗する
 */
type ValidCourseConfigs<Matches extends MatchConfig[]> =
  object extends Matches[number]["course"]
    ? "Empty `course` is not allowed"
    : Matches;
