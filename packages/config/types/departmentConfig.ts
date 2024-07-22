/**
 * @description 1つの部門設定の型
 */
export type DepartmentConfig<RobotTypes extends string[]> = {
  id: number;
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
