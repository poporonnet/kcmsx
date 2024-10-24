import { config, DepartmentType } from "config";
import { LabeledSegmentedControl } from "./LabeledSegmentedControl";

export const DepartmentSegmentedControl = ({
  departmentType,
  setDepartmentType,
}: {
  departmentType: DepartmentType;
  setDepartmentType: (departmentType: DepartmentType) => void;
}) => (
  <LabeledSegmentedControl
    label="部門:"
    data={config.departments.map(({ type, name }) => ({
      label: name,
      value: type,
    }))}
    value={departmentType}
    onChange={(value) => setDepartmentType(value as DepartmentType)}
  />
);
