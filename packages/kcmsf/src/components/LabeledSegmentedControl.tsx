import {
  Group,
  SegmentedControl,
  SegmentedControlItem,
  Text,
} from "@mantine/core";

export const LabeledSegmentedControl = ({
  label,
  data,
  value,
  onChange,
}: {
  label: string;
  data: (string | SegmentedControlItem)[];
  value: string;
  onChange: (value: string) => void;
}) => (
  <Group>
    <Text c="dark">{label}</Text>
    <SegmentedControl {...{ data, value, onChange }} w="7rem" />
  </Group>
);
