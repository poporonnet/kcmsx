export type DepartmentConfig<RobotTypes extends string[]> = {
  id: number;
  type: string;
  name: string;
  robotTypes: RobotTypes[number][];
};

export type DerivedDepartment<
  RobotTypes extends string[],
  Departments extends DepartmentConfig<RobotTypes>[],
> = {
  [D in Departments[number] as D["type"]]: Omit<D, "type">;
};
