import { ComboboxData, Select } from "@mantine/core";
import { useMemo } from "react";

export type CourtFilter = number | "all";

type Props = {
  courts: number[] | undefined;
  court: CourtFilter;
  setCourt: (value: CourtFilter) => void;
};
export const CourtSelector = ({ courts, court, setCourt }: Props) => {
  const courtSelection: ComboboxData = useMemo((): ComboboxData => {
    const courtData = courts?.map((court) => `${court}`) ?? [];
    return [
      {
        value: "all",
        label: "全てのコート",
      },
      ...courtData,
    ];
  }, [courts]);

  return (
    <Select
      maw={150}
      data={courtSelection}
      value={`${court}`}
      onChange={(value) => setCourt(value === "all" ? "all" : Number(value))}
      allowDeselect={false}
    />
  );
};
