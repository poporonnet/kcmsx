import { Cat } from "@mikuroxina/mini-fn";
import { DepartmentType, isDepartmentType } from "config";
import { useState } from "react";
import { useSearchParams } from "react-router-dom";

export const useDepartmentType = (defaultType: DepartmentType) => {
  const [searchParams] = useSearchParams();
  const departmentType = useState<DepartmentType>(
    Cat.cat(searchParams.get("department_type")).feed((value) =>
      value && isDepartmentType(value) ? value : defaultType
    ).value
  );

  return departmentType;
};
