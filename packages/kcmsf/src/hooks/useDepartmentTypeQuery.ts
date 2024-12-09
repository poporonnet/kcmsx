import { DepartmentType, isDepartmentType } from "config";
import { useQueryParamsState } from "./useQueryParamsState";

export const useDepartmentTypeQuery = (defaultType: DepartmentType) =>
  useQueryParamsState("department_type", defaultType, isDepartmentType);
