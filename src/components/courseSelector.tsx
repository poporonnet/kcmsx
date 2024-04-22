import { Select } from "@mantine/core";
type Props = {
  courses: number[] | undefined;
  selector: (value: number | "all") => void;
};
export const CourseSelector = (props: Props) => {
  const course = props.courses
    ? props.courses.map((courses) => String(courses))
    : [];
  course.unshift("全てのコート");
  return (
    <Select
      maw={150}
      placeholder="Pick value"
      data={course}
      defaultValue="全てのコート"
      onChange={(value) =>
        props.selector(value === "全てのコート" ? "all" : Number(value))
      }
    />
  );
};
