import { UniqueRecords } from "./uniqueCollection";

/**
 * @description 1つの部門設定の型
 */
export type DepartmentConfig<RobotTypes extends string[]> = {
  type: string;
  name: string;
  robotTypes: RobotTypes[number][];
};

/**
 * @description {@link DepartmentConfig}の配列から導出される部門設定のオブジェクト
 */
export type DerivedDepartment<
  RobotTypes extends string[],
  Departments extends DepartmentConfig<RobotTypes>[],
> = {
  [D in Departments[number] as D["type"]]: Omit<D, "type">;
};

/**
 * @description {@link Departments}が有効か判定する型
 * {@link DepartmentConfig}の`type`属性が重複していたらコンパイルに失敗する
 */
export type ValidDepartmentConfigs<
  RobotTypes extends string[],
  Departments extends DepartmentConfig<RobotTypes>[],
> =
  UniqueRecords<Departments, "type"> extends infer U
    ? Departments extends U
      ? Departments
      : U
    : never;
