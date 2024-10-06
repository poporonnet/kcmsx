import { Collect } from "../utility/pick";
import { RobotConfig } from "./robotConfig";
import { UniqueRecords } from "./uniqueCollection";

/**
 * @description 1つの部門設定の型
 */
export type DepartmentConfig<Robots extends RobotConfig[]> =
  DerivedDepartmentConfig<string, string, Robots[number]["type"][]>;

/**
 * @description 1つの部門設定の, リテラル型から導出される型
 */
export type DerivedDepartmentConfig<
  Type extends string,
  Name extends string,
  RobotTypes extends string[],
> = {
  type: Type;
  name: Name;
  robotTypes: RobotTypes;
};

/**
 * @description {@link DepartmentConfig}の配列から導出される部門設定のオブジェクト
 */
export type DerivedDepartment<
  Robots extends RobotConfig[],
  Departments extends DepartmentConfig<Robots>[],
> = {
  [D in Departments[number] as D["type"]]: Omit<D, "type">;
};

/**
 * @description {@link Departments}が有効か判定する型
 * {@link DepartmentConfig}の`type`属性が重複していたらコンパイルに失敗する
 */
export type ValidDepartmentConfigs<
  Robots extends RobotConfig[],
  Departments extends DepartmentConfig<Robots>[],
> =
  UniqueRecords<Departments, "type"> extends infer U
    ? Departments extends U
      ? Departments
      : U
    : never;
