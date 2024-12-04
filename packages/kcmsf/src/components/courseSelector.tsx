import { ComboboxData, Select } from "@mantine/core";
import { useMemo } from "react";
type Props = {
  courses: number[] | undefined;
  selector: (value: number | "all") => void;
};
export const CourseSelector = (props: Props) => {
  const courseSelection: ComboboxData = useMemo((): ComboboxData => {
    const course: ComboboxData =
      props.courses?.map((course) => `${course}`) ?? [];
    return [
      {
        value: "all",
        label: "全てのコート",
      },
      ...course,
    ];
  }, [props]);

  return (
    <Select
      maw={150}
      data={courseSelection}
      defaultValue="all"
      onChange={(value) =>
        props.selector(value === "all" ? "all" : Number(value))
      }
      allowDeselect={false}
    />
  );
};
